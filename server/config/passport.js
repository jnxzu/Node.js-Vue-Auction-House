const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const moment = require("moment");

const User = require("../models/user");

passport.use(
  "local-signup",
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err);

      if (user) return done(null, false);
      else {
        var newUser = new User();

        newUser.username = username;
        newUser.password = newUser.generateHash(password);

        newUser.save(function (err) {
          if (err) throw err;
          console.log(
            `${moment().format("MMMM Do YYYY, h:mm:ss a")} - ${
              newUser.username
            } registered.`
          );
          return done(null, newUser);
        });
      }
    });
  })
);

passport.use(
  "local-login",
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err);

      if (!user) {
        return done(null, false);
      }

      if (!user.validPassword(password)) return done(null, false);

      console.log(
        `${moment().format("MMMM Do YYYY, h:mm:ss a")} - ${
          user.username
        } logged in.`
      );
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      done(err);
    }
    if (user) {
      done(null, {
        id: user._id,
        username: user.username,
        password: user.password,
      });
    } else {
      done({
        msg: "Incorrect ID",
      });
    }
  });
});

module.exports = passport;
