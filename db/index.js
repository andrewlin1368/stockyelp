const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//get all stocks wtih comments in desc order
const getAllStocks = async () => {
  const stocks = await prisma.stocks.findMany({ orderBy: { stock_id: "asc" } });
  const stocksWithComments = [];
  for (let stock of stocks) {
    stocksWithComments.push({
      ...stock,
      comments: await prisma.comments.findMany({
        where: {
          stock_id: stock.stock_id,
        },
        orderBy: {
          created_at: "desc",
        },
      }),
    });
  }
  return stocksWithComments;
};

//get single stock
const getStock = async (symbol) => {
  const stock = await prisma.stocks.findFirst({
    where: {
      symbol,
    },
  });
  if (!stock) return { error: "Stock not found!" };
  return stock;
};

//add a new stock (ADMIN ONLY)
const addStock = async ({
  user_id,
  fullname,
  symbol,
  description,
  price,
  week_low,
  week_high,
}) => {
  const user = await prisma.users.findFirst({ where: { user_id } });
  if (!user || !user.isadmin) return { error: "Invalid credentials!" };
  const current_data = new Date();
  const checkStock = await prisma.stocks.findFirst({
    where: { OR: [{ fullname }, { symbol }] },
  });
  if (checkStock) return { error: "Stock already exist!" };
  const stock = await prisma.stocks.create({
    data: {
      fullname,
      symbol: symbol.toUpperCase(),
      description,
      week_high: week_high || 0,
      week_low: week_low || 0,
      price: price || 0,
      current_data: current_data.toISOString(),
    },
  });
  return { ...stock, comments: [] };
};

//edit an existing stock (ADMIN ONLY)
const editStock = async ({
  user_id,
  stock_id,
  description,
  price,
  week_low,
  week_high,
}) => {
  const user = await prisma.users.findFirst({ where: { user_id } });
  if (!user || !user.isadmin) return { error: "Invalid credentials!" };
  const current_data = new Date();
  let stock = await prisma.stocks.findFirst({ where: { stock_id } });
  stock = await prisma.stocks.update({
    where: { stock_id },
    data: {
      description,
      price: price || stock.price,
      week_high: week_high || stock.week_high,
      week_low: week_low || stock.week_low,
      current_data: current_data,
    },
  });
  return stock;
};

//remove comment - Will not delete but instead updated isdeleted to true and front end will display "Comment has been deleted." profile.comment slice and stocks slice will be updated
const removeComment = async ({ comment_id, user_id }) => {
  let comment = await prisma.comments.findFirst({ where: { comment_id } });
  if (comment.user_id !== user_id) return { error: "Not original creator!" };
  if (comment.isdeleted) return { error: "Comment has already been removed!" };
  comment = await prisma.comments.update({
    where: { comment_id },
    data: { isdeleted: true },
  });
  return comment;
};

//add a comment - will return single comment to update stocks slice and update profile.comment slice to keep time ordering
const createComment = async ({ stock_id, user_id, message }) => {
  const user = await prisma.users.findFirst({ where: { user_id } });
  const comment = await prisma.comments.create({
    data: { stock_id, user_id, message, username: user.username },
  });
  return comment;
};

//edit a comment
const editComment = async ({ comment_id, user_id, message }) => {
  let comment = await prisma.comments.findFirst({ where: { comment_id } });
  if (comment.user_id !== user_id) return { error: "Not original creator!" };
  if (comment.isdeleted) return { error: "Comment has already been removed!" };
  comment = await prisma.comments.update({
    where: { comment_id },
    data: { message },
  });
  return comment;
};

//user can upvote a stock - check if user already downvote if so remove it, stock slice should update stock data
const upvote = async ({ stock_id, user_id }) => {
  const isUpvote = await prisma.upvote.findFirst({
    where: { stock_id, AND: { user_id } },
  });
  if (isUpvote) return { error: "Already upvoted!" };
  const isDownvote = await prisma.downvote.findFirst({
    where: { stock_id, AND: { user_id } },
  });
  let updateStock = await prisma.stocks.findFirst({
    where: { stock_id },
  });
  const data = { upvotes: ++updateStock.upvotes };
  if (isDownvote) {
    await prisma.downvote.delete({ where: { vote_id: isDownvote.vote_id } });
    data.downvotes = --updateStock.downvotes;
  }
  updateStock = await prisma.stocks.update({
    where: {
      stock_id,
    },
    data: data,
  });
  await prisma.upvote.create({ data: { user_id, stock_id } });
  return updateStock;
};

//user can downvote a stock - check if user already upvote if so remove it, stock slice should update stock data
const downvote = async ({ stock_id, user_id }) => {
  const isDownvote = await prisma.downvote.findFirst({
    where: { stock_id, AND: { user_id } },
  });
  if (isDownvote) return { error: "Already downvoted!" };
  const isUpvote = await prisma.upvote.findFirst({
    where: { stock_id, AND: { user_id } },
  });
  let updateStock = await prisma.stocks.findFirst({ where: { stock_id } });
  const data = { downvotes: ++updateStock.downvotes };
  if (isUpvote) {
    await prisma.upvote.delete({ where: { vote_id: isUpvote.vote_id } });
    data.upvotes = --updateStock.upvotes;
  }
  updateStock = await prisma.stocks.update({
    where: {
      stock_id,
    },
    data: data,
  });
  await prisma.downvote.create({ data: { user_id, stock_id } });
  return updateStock;
};

//follow a stock - return value set up to easily add into profile.following slice in frontend
const follow = async ({ stock_id, user_id }) => {
  let isFollowing = await prisma.profiles.findFirst({
    where: { stock_id, AND: { user_id } },
  });
  if (isFollowing) return { error: "Already following!" };
  isFollowing = await prisma.profiles.create({ data: { stock_id, user_id } });
  return isFollowing;
};

//unfollow a stock - return value set up to easily remove from profile.following slice in frontend
const unfollow = async ({ stock_id, user_id }) => {
  let notFollowing = await prisma.profiles.findFirst({
    where: { stock_id, AND: { user_id } },
  });
  if (!notFollowing) return { error: "Already not following!" };
  notFollowing = await prisma.profiles.delete({
    where: { profile_id: notFollowing.profile_id },
  });
  return notFollowing;
};

//get user profile (user data, stocks following) CAN BE IGNORED LOGIN/REGISTER WILL RETURN PROFILE WILL INSTEAD BY USED BY USERS TO SEE OTHER USERS
const getProfile = async (user_id) => {
  const user = await prisma.users.findFirst({ where: { user_id } });
  if (!user) return { error: "Invalid credentials!" };
  const following = await prisma.profiles.findMany({ where: { user_id } });
  // const comments = await prisma.comments.findMany({
  //   where: { user_id },
  //   orderBy: [{ stock_id: "asc" }, { created_at: "desc" }],
  // });
  delete user.password;
  return { user, following };
};

//register a user
const register = async ({
  username,
  firstname,
  lastname,
  password,
  admincode,
}) => {
  if (admincode.length && admincode !== "8773934448")
    return { error: "Invalid Code!" };
  let user = await prisma.users.findFirst({ where: { username } });
  if (user) return { error: "User already exists!" };
  if (password.length < 8)
    return { error: "Password must be atleast 8 characters!" };
  const salt = await bcrypt.genSalt(8);
  const hashPass = await bcrypt.hash(password, salt);
  user = await prisma.users.create({
    data: {
      username,
      firstname,
      lastname,
      password: hashPass,
      isadmin: admincode.length ? true : false,
    },
  });
  delete user.password;
  const token = jwt.sign({ user_id: user.user_id }, process.env.JWT);
  return { user, token, following: [], comments: [] };
};

//login a user
const login = async ({ username, password }) => {
  const user = await prisma.users.findFirst({ where: { username } });
  if (!user) return { error: "Invalid credentials!" };
  const check = await bcrypt.compare(password, user.password);
  if (!check) return { error: "Invalid credentials!" };
  const following = await prisma.profiles.findMany({
    where: { user_id: user.user_id },
  });
  const comments = await prisma.comments.findMany({
    where: { user_id: user.user_id },
    orderBy: { created_at: "desc" },
  });
  delete user.password;
  const token = jwt.sign({ user_id: user.user_id }, process.env.JWT);
  return { user, following, comments, token };
};

//edit user info
const updateUser = async ({ user_id, firstname, lastname, password }) => {
  const data = { firstname, lastname };
  if (password && password.length) {
    const salt = await bcrypt.genSalt(8);
    const hashPass = await bcrypt.hash(password, salt);
    data.password = hashPass;
  }
  const user = await prisma.users.update({
    where: { user_id },
    data: data,
  });
  delete user.password;
  return user;
};

const contactMe = async ({ email, message }) => {
  const data = { message_email: email, message_message: message };
  const result = await prisma.message.create({
    data: data,
  });
  return !result ? false : true;
};

const getAllMessage = async (id) => {
  const admin = await prisma.users.findFirst({
    where: { user_id: id },
  });
  if (!admin.isadmin) return { error: "Invalid credentials!" };
  const result = await prisma.message.findMany({
    where: {
      message_isdeleted: false,
    },
    orderBy: {
      message_date: "desc",
    },
  });
  return { messages: result };
};

const deleteMessage = async (message_id, id) => {
  const admin = await prisma.users.findFirst({
    where: { user_id: id },
  });
  if (!admin.isadmin) return { error: "Invalid credentials!" };
  const result = await prisma.message.update({
    where: {
      message_id,
    },
    data: {
      message_isdeleted: true,
    },
  });
  return { message_id: result.message_id };
};

module.exports = {
  prisma,
  getAllStocks,
  getStock,
  getProfile,
  register,
  login,
  follow,
  unfollow,
  upvote,
  downvote,
  removeComment,
  createComment,
  editComment,
  addStock,
  editStock,
  updateUser,
  contactMe,
  getAllMessage,
  deleteMessage,
};
