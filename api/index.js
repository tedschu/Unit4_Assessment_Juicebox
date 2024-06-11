// api/index.js
const express = require("express");
const apiRouter = express.Router();

const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");
const { JWT_SECRET } = "secret";

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const postsRouter = require("./posts");
apiRouter.use("/posts", postsRouter);

const tagsRouter = require("./tags");
apiRouter.use("/tags", tagsRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
