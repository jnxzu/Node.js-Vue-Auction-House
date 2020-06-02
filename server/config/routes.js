const express = require("express");
const router = express.Router();
const path = require("path");
const moment = require("moment");

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
  .route("/chat")
  .get((req, res) => {
    if (!req.isAuthenticated()) res.redirect("/");
    else res.sendFile(path.join(__dirname, "../public", "chat.html"));
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
  .post((req, res) => {
    Auction.findOne({ item: req.body.item }, function (err, auction) {
      if (err) {
        res.send({ success: false });
        return null;
      }
      if (auction) {
        res.send({ success: false });
        return null;
      } else {
        var newAuction = new Auction();
        newAuction.host = req.user.id;
        newAuction.item = req.body.item;
        if (newAuction.item.length < 2) {
          res.send({ success: false });
          return null;
        }
        newAuction.price = req.body.price;
        if (newAuction.price < 1) {
          res.send({ success: false });
          return null;
        }
        newAuction.expiry = moment().add(90, "m");
        newAuction.finished = false;
        newAuction.quickbuy = req.body.quickbuy;
        newAuction.save().then((a) => {
          User.findByIdAndUpdate(req.user.id, {
            $push: { hosting: a._id },
          }).then((u) => {
            console.log(u);
            res.send({ success: true });
          });
        });
      }
    });
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
    else res.send({ authenticated: false, username: "" });
  })
  .all(rejectMethod);

router.route("/getListings").post((req, res) => {
  let query = {};
  switch (req.body.query) {
    case "listings":
      query = { expiry: { $gte: new Date() } };
      break;

    case "history":
      query = {
        $and: [
          { expiry: { $lte: new Date() } },
          { $or: [{ topBid: req.user.id }, { host: req.user.id }] },
        ],
      };
      break;

    case "dash":
      query = {
        $and: [{ expiry: { $gte: new Date() } }, { allBids: req.user.id }],
      };
      break;

    default:
      break;
  }
  Auction.find(query)
    .populate("host")
    .populate("topBid")
    .lean()
    .exec(function (err, auctions) {
      res.send({ listings: auctions });
    });
});

router.route("/bid").post((req, res) => {
  let firstOperation = req.body.quickbuy
    ? {
        $set: { topBid: req.user.id, finished: true },
        $push: { allBids: req.user.id },
      }
    : {
        $inc: { price: 1 },
        $set: { topBid: req.user.id },
        $push: { allBids: req.user.id },
      };

  Auction.findOneAndUpdate({ item: req.body.item }, firstOperation).then(
    (a) => {
      let secondOperation = req.body.quickbuy
        ? {
            $push: {
              allBids: a._id,
              topBids: a._id,
            },
          }
        : { $push: { allBids: a._id } };

      User.findByIdAndUpdate(req.user.id, secondOperation);
    }
  );
});

module.exports = router;
