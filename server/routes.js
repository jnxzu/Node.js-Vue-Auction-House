const express = require("express");
const router = express.Router();

const User = require("./models/user");

router.route("/").get((req, res) => {
  console.log("Index");
});
