const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt"); // imports bcrypt for passwords

//const { requireUser } = require("./utils");

const {
  getAllUsers,
  authenticateLogin,
  createUserAndGenerateToken,
} = require("../db");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret";

// (works) gets all users, returning user objects
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.send({
      users,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// (works) logs in user IF the username exists AND hashed password matches plain text password via bcrypt.compare
usersRouter.post("/login", async (req, res, next) => {
  // const { username, password } = req.body;

  //request must have both
  if (!req.body.username || !req.body.password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    res.send(await authenticateLogin(req.body));
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// (works) registers a user, returning the token
usersRouter.post("/register", async (req, res, next) => {
  try {
    res.send(await createUserAndGenerateToken(req.body));
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;

// token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsImlhdCI6MTcxODA0MDE1N30.e1KucMqMGE5pP-5O4gXlEaSxpqFdBCHKzDIPWHIamGM
// User: Test19, Pass: password
