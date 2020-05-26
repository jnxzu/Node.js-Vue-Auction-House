const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Chat = require("../models/chat");
const Auction = require("../models/auction");

const rejectMethod = (_req, res, _next) => {
  res.sendStatus(405);
};

router
  .route("/")
  .get((req, res) => {})
  .all(rejectMethod);

router
  .route("/chats")
  .get((req, res) => {})
  .all(rejectMethod);

router
  .route("/dashboard")
  .get((req, res) => {})
  .all(rejectMethod);

router
  .route("/list")
  .get((req, res) => {})
  .all(rejectMethod);

router
  .route("/listings")
  .get((req, res) => {})
  .all(rejectMethod);

router
  .route("/login")
  .get((req, res) => {})
  .post(passport.authenticate("local-login"), async (req, res) => {
    await res.redirect("/");
  })
  .all(rejectMethod);

router
  .route("/signup")
  .get((req, res) => {})
  .post(passport.authenticate("local-signup"), async (req, res) => {
    await res.redirect("/");
  })
  .all(rejectMethod);

router
  .route("/logout")
  .get((req, res) => {})
  .all(rejectMethod);

module.exports = router;
