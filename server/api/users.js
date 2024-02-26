const express = require("express");
const userRouter = express.Router();
const { verifyToken } = require("../middleware/token.js");
const { getProfile, register, login } = require("../../db/index.js");

//get user profile (user info, stocks followed, comments) CAN BE IGNORED LOGIN/REGISTER WILL RETURN PROFILE
userRouter.get("/profile", verifyToken, async (req, res, next) => {
  try {
    return !req.user
      ? res.status(400).send({ error: "Not logged in." })
      : res.send({ profile: await getProfile(req.user.user_id) });
  } catch (error) {
    next(error);
  }
});

//login
userRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send({ error: "All fields are required" });
    const data = await login({ username, password });
    return data.error
      ? res.status(400).send({ error: data.error })
      : res.send({ profile: data });
  } catch (error) {
    next(error);
  }
});

//register
userRouter.post("/register", async (req, res, next) => {
  try {
    const { username, firstname, lastname, password } = req.body;
    if (!username || !firstname || !lastname || !password)
      return res.status(400).send({ error: "All fields are required" });
    const data = await register({
      username,
      firstname,
      lastname,
      password,
    });
    return data.error
      ? res.status(400).send({ error: data.error })
      : res.send({ profile: data });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
