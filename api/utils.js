//const express = require("express");
const { findUserWithToken } = require("../db");

// (works) Checks header for token and return a user object set to req.user
async function requireUser(req, res, next) {
  console.log("test");
  try {
    //console.log("This is the header token: ", req.headers.authorization);
    req.user = await findUserWithToken(req.headers.authorization);
    //console.log("req.user is:", req.user);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requireUser,
};
