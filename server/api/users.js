const express = require("express");
const userRouter = express.Router();
const { verifyToken } = require("../middleware/token.js");
const {
  getProfile,
  register,
  login,
  updateUser,
} = require("../../db/index.js");

//get user profile (user info, stocks followed) CAN BE IGNORED LOGIN/REGISTER WILL RETURN PROFILE/ USER WILL USE THIS TO SEE OTHER USERS
userRouter.post("/profile", async (req, res, next) => {
  try {
    res.send({ profile: await getProfile(req.body.user_id) });
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

//update user info
userRouter.put("/", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid credentials" });
    const { firstname, lastname, password } = req.body;
    if (!firstname || !lastname || !firstname.length || !lastname.length)
      return res.status(400).send({ error: "All fields are required" });
    if (password && password.length < 8)
      return res
        .status(400)
        .send({ error: "Password must be atleast 8 characters" });
    res.send(
      await updateUser({
        user_id: req.user.user_id,
        firstname,
        lastname,
        password,
      })
    );
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
