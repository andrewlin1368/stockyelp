const express = require("express");
const stockRouter = express.Router();
const {
  getAllStocks,
  getStock,
  follow,
  unfollow,
  upvote,
  downvote,
  removeComment,
  createComment,
} = require("../../db/index.js");
const { verifyToken } = require("../middleware/token.js");

//gets all the stocks and its comments
stockRouter.get("/", async (req, res, next) => {
  try {
    res.send({ stocks: await getAllStocks() });
  } catch (error) {
    next(error);
  }
});

//get single stock and its comments
stockRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    res.send({ stocks: await getStock(Number(id)) });
  } catch (error) {
    next(error);
  }
});

//user can follow a stock
stockRouter.post("/follow", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid credentials" });
    const { stock_id } = req.body;
    const data = await follow({ stock_id, user_id: req.user.user_id });
    return data.error
      ? res.status(400).send({ error: data.error })
      : res.send(data);
  } catch (error) {
    next(error);
  }
});

//user can unfollow a stock
stockRouter.delete("/unfollow", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid credentials" });
    const { stock_id } = req.body;
    const data = await unfollow({ stock_id, user_id: req.user.user_id });
    return data.error
      ? res.status(400).send({ error: data.error })
      : res.send(data);
  } catch (error) {
    next(error);
  }
});

//user can upvote a stock (CANNOT HAVE DOWNVOTE)
stockRouter.post("/upvote", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid credentials" });
    const { stock_id } = req.body;
    const data = await upvote({ stock_id, user_id: req.user.user_id });
    return data.error
      ? res.status(400).send({ error: data.error })
      : res.send(data);
  } catch (error) {
    next(error);
  }
});

//user can downvote a stock (CANNOT HAVE UPVOTE)
stockRouter.post("/downvote", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid credentials" });
    const { stock_id } = req.body;
    const data = await downvote({ stock_id, user_id: req.user.user_id });
    return data.error
      ? res.status(400).send({ error: data.error })
      : res.send(data);
  } catch (error) {
    next(error);
  }
});

//remove a comment
stockRouter.put("/removecomment", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid credentials" });
    const { comment_id } = req.body;
    const data = await removeComment({ comment_id, user_id: req.user.user_id });
    return data.error
      ? res.status(400).send({ error: data.error })
      : res.send(data);
  } catch (error) {
    next(error);
  }
});

//create comment
stockRouter.post("/addcomment", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid credentials" });
    const { stock_id, message } = req.body;
    if (message.length === 0)
      return res.status(400).send({ error: "Cannot post empty messages" });
    return res.send(
      await createComment({ stock_id, user_id: req.user.user_id, message })
    );
  } catch (error) {
    next(error);
  }
});

module.exports = stockRouter;
