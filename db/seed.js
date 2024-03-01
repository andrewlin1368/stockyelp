const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const { description, profile } = require("./data");
const { prisma } = require("./index.js");
const stockPath = path.join(__dirname, "stocks.csv");
const bcrypt = require("bcrypt");

const stocks = [];

const readCsv = async () => {
  return new Promise((resolve, reject) => {
    console.log("reading from csv file...");
    let counter = 0;
    const readStream = fs.createReadStream(stockPath).pipe(
      parse({ delimiter: ",", from_line: 2 })
        .on("data", (row) => {
          console.log("creating data...");
          const date = new Date(row[5]);
          stocks.push({
            description: description[counter++],
            symbol: row[0],
            fullname: row[1],
            price: row[2],
            week_high: row[3],
            week_low: row[4],
            current_data: date.toISOString(),
          });
        })
        .on("error", (error) => {
          reject(new Error(error));
        })
        .on("end", () => {
          console.log("done creating data.");
          readStream.destroy();
          resolve(stocks);
        })
    );
  });
};

const clearTables = async () => {
  try {
    console.log("clear tables...");
    await prisma.upvote.deleteMany();
    await prisma.downvote.deleteMany();
    await prisma.profiles.deleteMany();
    await prisma.comments.deleteMany();
    await prisma.stocks.deleteMany();
    await prisma.users.deleteMany();
    await prisma.$executeRaw`alter sequence "stocks_stock_id_seq" restart with 1`;
    await prisma.$executeRaw`alter sequence "users_user_id_seq" restart with 1`;
    await prisma.$executeRaw`alter sequence "profiles_profile_id_seq" restart with 1`;
    await prisma.$executeRaw`alter sequence "comments_comment_id_seq" restart with 1`;
    await prisma.$executeRaw`alter sequence "upvote_vote_id_seq" restart with 1`;
    await prisma.$executeRaw`alter sequence "downvote_vote_id_seq" restart with 1`;
    console.log("finish clearing tables");
  } catch (error) {
    console.error(error);
  }
};

const addStocks = async () => {
  try {
    console.log("adding to stocks table...");
    await prisma.stocks.createMany({
      data: stocks,
    });
    console.log("finish adding to stocks table");
  } catch (error) {
    console.error(error);
  }
};

const addUsers = async () => { 
  try {
    console.log("adding to users table...");
    const salt = await bcrypt.genSalt(8);
    const hashPass = await bcrypt.hash("password", salt);
    const users = [
      {
        username: "andrew123",
        firstname: "andrew",
        lastname: "lin",
        password: hashPass,
        isadmin: true,
      },
      {
        username: "andrew1234",
        firstname: "andrew",
        lastname: "lin",
        password: hashPass,
        isadmin: false,
      },
    ];
    await prisma.users.createMany({
      data: users,
    });
    console.log("finish adding to users table");
  } catch (error) {
    console.error(error);
  }
};

const addProfiles = async () => {
  try {
    console.log("adding to profiles table...");
    await prisma.profiles.createMany({
      data: profile().profiles,
    });
    console.log("finish adding to profiles table");
  } catch (error) {
    console.error(error);
  }
};

const addComments = async () => {
  try {
    console.log("adding to comments table...");
    await prisma.comments.createMany({
      data: profile().comments,
    });
    console.log("finish adding to comments table");
  } catch (error) {
    console.error(error);
  }
};

const initalSetup = async () => {
  await readCsv();
  await clearTables();
  await addStocks();
  await addUsers();
  await addProfiles();
  await addComments();
};

initalSetup();
