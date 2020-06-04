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

module.exports = (io) => {
  // index
  router
    .route("/")
    .get((req, res) => {
      res.sendFile(path.join(__dirname, "../public", "index.html"));
    })
    .all(rejectMethod);

  // chat
  router
    .route("/chat")
    .get((req, res) => {
      if (!req.isAuthenticated()) res.redirect("/");
      else res.sendFile(path.join(__dirname, "../public", "chat.html"));
    })
    .all(rejectMethod);

  // dashboard (all listings where the user has bid)
  router
    .route("/dashboard")
    .get((req, res) => {
      if (!req.isAuthenticated()) res.redirect("/");
      else res.sendFile(path.join(__dirname, "../public", "dashboard.html"));
    })
    .all(rejectMethod);

  // list (list a new item)
  router
    .route("/list")
    .get((req, res) => {
      if (!req.isAuthenticated()) res.redirect("/");
      else res.sendFile(path.join(__dirname, "../public", "list.html"));
    })
    .post((req, res) => {
      // sends success status to style input field in frontent
      Auction.findOne({ item: req.body.item }).then((auction) => {
        if (auction) {
          res.send({ success: false }); // item already listed
          return null;
        } else {
          var newAuction = new Auction();
          newAuction.host = req.user.id;
          newAuction.item = req.body.item;
          if (newAuction.item.length < 2) {
            res.send({ success: false }); // name too short
            return null;
          }
          newAuction.price = req.body.price;
          if (newAuction.price < 1) {
            res.send({ success: false }); // price too low
            return null;
          }
          newAuction.expiry = moment().add(90, "s");
          newAuction.finished = false;
          newAuction.quickbuy = req.body.quickbuy;
          newAuction.save().then((a) => {
            User.findByIdAndUpdate(req.user.id, {
              $push: { hosting: a._id }, // add it to user's record
            }).then(() => {
              console.log(
                `${moment().format("MMMM Do YYYY, h:mm:ss a")} - ${
                  newAuction.item
                } listed by ${newAuction.host} for ${newAuction.price}.`
              );
              io.sockets.emit("updateListings");
              res.send({ success: true });
            });
          });
        }
      });
    })
    .all(rejectMethod);

  // listings (all active listings)
  router
    .route("/listings")
    .get((req, res) => {
      io.on("connection", function (socket) {
        socket.emit("test");
      });
      res.sendFile(path.join(__dirname, "../public", "listings.html"));
    })
    .all(rejectMethod);

  // history (inactive listings listed or bough by user)
  router
    .route("/history")
    .get((req, res) => {
      if (!req.isAuthenticated()) res.redirect("/");
      else res.sendFile(path.join(__dirname, "../public", "history.html"));
    })
    .all(rejectMethod);

  // login
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

  // signup
  router
    .route("/signup")
    .get((req, res) => {
      if (req.isAuthenticated()) res.redirect("/");
      else res.sendFile(path.join(__dirname, "../public", "signup.html"));
    })
    .post(passport.authenticate("local-signup"), async (req, res) => {
      io.sockets.emit("updateUsers");
      res.redirect("/");
    })
    .all(rejectMethod);

  // logout
  router
    .route("/logout")
    .get((req, res) => {
      if (!req.isAuthenticated()) res.redirect("/");
      else {
        console.log(
          `${moment().format("MMMM Do YYYY, h:mm:ss a")} - ${
            req.user.username
          } logged out.`
        );
        req.logout();
        res.redirect("/");
      }
    })
    .all(rejectMethod);

  // authenticating function
  router
    .route("/auth")
    .post((req, res) => {
      if (req.isAuthenticated())
        res.send({ authenticated: true, username: req.user.username });
      else res.send({ authenticated: false, username: "" });
    })
    .all(rejectMethod);

  // retrieval of listings
  router.route("/getListings").post((req, res) => {
    let query = {};
    switch (
      req.body.query // different query depending on which page requests it
    ) {
      case "listings":
        query = { finished: false };
        break;

      case "history":
        query = {
          $and: [
            { finished: true },
            { $or: [{ topBid: req.user.id }, { host: req.user.id }] },
          ],
        };
        break;

      case "dash":
        query = {
          $and: [
            { expiry: { $gte: new Date() } },
            { allBids: req.user.id },
            { finished: false },
          ],
        };
        break;

      default:
        break;
    }
    Auction.find(query)
      .populate("host")
      .populate("topBid")
      .then((auctions) => {
        res.send({ listings: auctions });
      });
  });

  // bidding or buying function
  router.route("/bid").post((req, res) => {
    let firstOperation = req.body.quickbuy // auction update operation depending on type of auction
      ? {
          $set: { topBid: req.user.id, finished: true, expiry: moment() },
          $push: { allBids: req.user.id },
        }
      : {
          $inc: { price: 1 },
          $set: { topBid: req.user.id },
          $push: { allBids: req.user.id },
        };

    Auction.findOneAndUpdate({ item: req.body.item }, firstOperation).then(
      (a) => {
        let secondOperation = req.body.quickbuy // user update operation depending on type of auction
          ? {
              $push: {
                allBids: a._id,
                topBids: a._id,
              },
            }
          : { $push: { allBids: a._id } };

        User.findByIdAndUpdate(req.user.id, secondOperation).then(() => {
          if (req.body.quickbuy)
            console.log(
              `${moment().format("MMMM Do YYYY, h:mm:ss a")} - ${
                req.user.username
              } bought ${a.item} for ${a.price}.`
            );
          else
            console.log(
              `${moment().format("MMMM Do YYYY, h:mm:ss a")} - ${
                req.user.username
              } bid ${a.price} for ${a.item}.`
            );
          io.sockets.emit("updateListings");
        });
      }
    );
  });

  // users retrieval function (except for requesting user)
  router
    .route("/getUsers")
    .post((req, res) => {
      User.find({ username: { $ne: req.body.excluded } }).then((users) => {
        res.send({ users: users });
      });
    })
    .all(rejectMethod);

  // message retrieval function
  router.route("/getMessages").post((req, res) => {
    // find the message reciever
    User.findOne({ username: req.body.target }).then((messageTarget) => {
      // check if chat exists between these two users
      Chat.findOne({ users: { $all: [req.user.id, messageTarget._id] } })
        .populate("messages.author")
        .then((chat) => {
          if (chat) res.send({ messages: chat.messages });
          // create it if it doesnt
          else {
            var newChat = new Chat();
            newChat.users = [req.user.id, messageTarget._id];
            newChat.messages = [];
            newChat.save().then((newC) => {
              // update both user records
              messageTarget.chats.push(newC._id);
              messageTarget.save().then(() => {
                User.findOneAndUpdate(
                  { username: req.user.username },
                  { $push: { chats: newC._id } }
                ).then(res.send({ messages: newC.messages }));
              });
            });
          }
        });
    });
  });

  // message send function
  router
    .route("/sendMsg")
    .post((req, res) => {
      // create message
      let msg = {
        author: req.user.id,
        content: req.body.content,
        date: moment(),
      };
      // find message reciever
      User.findOne({ username: req.body.target }).then((messageTarget) => {
        // update chat record
        Chat.findOneAndUpdate(
          {
            users: { $all: [req.user.id, messageTarget._id] },
          },
          { $push: { messages: msg } }
        ).then(() => {
          console.log(
            `${moment().format("MMMM Do YYYY, h:mm:ss a")} - ${
              req.user.username
            } sent "${msg.content}" to ${messageTarget.username}.`
          );
          res.send({ clear: "" });
          io.sockets.emit("updateMessages");
        });
      });
    })
    .all(rejectMethod);

  // auction timeout function
  router
    .route("/timeOutAuction")
    .post((req, res) => {
      // find the auction
      Auction.findOneAndUpdate(
        { item: req.body.item, finished: false },
        { $set: { finished: true } }
      )
        .populate("topBid")
        .then((a) => {
          if (a.topBid)
            // if it had a bid award the auction to top bidder
            User.findOneAndUpdate(
              { username: a.topBid.username },
              { $push: { topBids: a._id } }
            ).then((u) => {
              console.log(
                `${moment().format("MMMM Do YYYY, h:mm:ss a")} - ${
                  u.username
                } won the auction for "${a.item}" with a bid of ${a.price}.`
              );
              io.sockets.emit("updateListings");
            });
        });
    })
    .all(rejectMethod);

  return router;
};
