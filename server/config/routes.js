const express = require("express");
const router = express.Router();
const path = require("path");

const passport = require("../config/passport");

const User = require("../models/user");
const Chat = require("../models/chat");
const Auction = require("../models/auction");

const rejectMethod = (_req, res, _next) => {
  res.sendStatus(405);
};

router
  .route("/")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  })
  .all(rejectMethod);

router
  .route("/chats")
  .get((req, res) => {
    if (!req.isAuthenticated()) res.redirect("/");
    else res.sendFile(path.join(__dirname, "../public", "chats.html"));
  })
  .all(rejectMethod);

router
  .route("/dashboard")
  .get((req, res) => {
    if (!req.isAuthenticated()) res.redirect("/");
    else res.sendFile(path.join(__dirname, "../public", "dashboard.html"));
  })
  .all(rejectMethod);

router
  .route("/list")
  .get((req, res) => {
    if (!req.isAuthenticated()) res.redirect("/");
    else res.sendFile(path.join(__dirname, "../public", "list.html"));
  })
  .all(rejectMethod);

router
  .route("/listings")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../public", "listings.html"));
  })
  .all(rejectMethod);

router
  .route("/history")
  .get((req, res) => {
    if (!req.isAuthenticated()) res.redirect("/");
    else res.sendFile(path.join(__dirname, "../public", "history.html"));
  })
  .all(rejectMethod);

router
  .route("/login")
  .get((req, res) => {
    if (req.isAuthenticated()) res.redirect("/");
    else res.sendFile(path.join(__dirname, "../public", "login.html"));
  })
  .post(passport.authenticate("local-login"), async (req, res) => {
    res.redirect("/");
  })
  .all(rejectMethod);

router
  .route("/signup")
  .get((req, res) => {
    if (req.isAuthenticated()) res.redirect("/");
    else res.sendFile(path.join(__dirname, "../public", "signup.html"));
  })
  .post(passport.authenticate("local-signup"), async (req, res) => {
    res.redirect("/");
  })
  .all(rejectMethod);

router
  .route("/logout")
  .get((req, res) => {
    if (!req.isAuthenticated()) res.redirect("/");
    else {
      req.logout();
      res.redirect("/");
    }
  })
  .all(rejectMethod);

router
  .route("/auth")
  .post((req, res) => {
    if (req.isAuthenticated())
      res.send({ authenticated: true, username: req.user.username });
    else res.send({ authenticated: false, username: "Guest" });
  })
  .all(rejectMethod);

module.exports = router;
