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

//get single stock with comments in desc order
const getStock = async (stock_id) => {
  const stock = await prisma.stocks.findFirst({
    where: {
      stock_id,
    },
  });
  if (!stock) return [];
  const comments = await prisma.comments.findMany({
    where: {
      stock_id,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return { ...stock, comments };
};

//remove comment - Will not delete but instead updated isdeleted to true and front end will display "Comment has been deleted." profile.comment slice and stocks slice will be updated
const removeComment = async ({ comment_id, user_id }) => {
  let comment = await prisma.comments.findFirst({ where: { comment_id } });
  if (comment.user_id !== user_id) return { error: "Not original creator" };
  if (comment.isdeleted) return { error: "Comment has already been removed" };
  comment = await prisma.comments.update({
    where: { comment_id },
    data: { isdeleted: true },
  });
  return comment;
};

//add a comment - will return single comment to update stocks slice and update profile.comment slice to keep time ordering
const createComment = async ({ stock_id, user_id, message }) => {
  const comment = await prisma.comments.create({
    data: { stock_id, user_id, message },
  });
  return comment;
};

//user can upvote a stock - check if user already downvote if so remove it, stock slice should update stock data
const upvote = async ({ stock_id, user_id }) => {
  const isUpvote = await prisma.upvote.findFirst({
    where: { stock_id, AND: { user_id } },
  });
  if (isUpvote) return { error: "Already upvoted" };
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
  if (isDownvote) return { error: "Already downvoted" };
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
  if (isFollowing) return { error: "Already following" };
  isFollowing = await prisma.profiles.create({ data: { stock_id, user_id } });
  return isFollowing;
};

//unfollow a stock - return value set up to easily remove from profile.following slice in frontend
const unfollow = async ({ stock_id, user_id }) => {
  let notFollowing = await prisma.profiles.findFirst({
    where: { stock_id, AND: { user_id } },
  });
  if (!notFollowing) return { error: "Already not following" };
  notFollowing = await prisma.profiles.delete({
    where: { profile_id: notFollowing.profile_id },
  });
  return notFollowing;
};

//get user profile (user data, stocks following, all comments made) CAN BE IGNORED LOGIN/REGISTER WILL RETURN PROFILE
const getProfile = async (user_id) => {
  const user = await prisma.users.findFirst({ where: { user_id } });
  if (!user) return { error: "Invalid credentials" };
  const following = await prisma.profiles.findMany({ where: { user_id } });
  const comments = await prisma.comments.findMany({
    where: { user_id },
    orderBy: [{ stock_id: "asc" }, { created_at: "desc" }],
  });
  delete user.password;
  return { user, following, comments };
};

//register a user
const register = async ({ username, firstname, lastname, password }) => {
  let user = await prisma.users.findFirst({ where: { username } });
  if (user) return { error: "User already exists" };
  if (password.length < 8)
    return { error: "Password must be atleast 8 characters" };
  const salt = await bcrypt.genSalt(8);
  const hashPass = await bcrypt.hash(password, salt);
  user = await prisma.users.create({
    data: {
      username,
      firstname,
      lastname,
      password: hashPass,
    },
  });
  delete user.password;
  const token = jwt.sign({ user_id: user.user_id }, process.env.JWT);
  return { user, token, following: [], comments: [] };
};

//login a user
const login = async ({ username, password }) => {
  const user = await prisma.users.findFirst({ where: { username } });
  if (!user) return { error: "Invalid credentials" };
  const check = await bcrypt.compare(password, user.password);
  if (!check) return { error: "Invalid credentials" };
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
};
