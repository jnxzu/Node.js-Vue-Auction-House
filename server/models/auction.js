const mongoose = require("../config/mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  item: { type: String, unique: true, minlength: 2 },
  price: { type: Number, min: 1 },
  topBid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  expiry: {
    type: Date,
  },
  quickbuy: {
    type: Boolean,
  },
  allBids: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const uniqueValidator = require("mongoose-unique-validator");
auctionSchema.plugin(uniqueValidator);

const Auction = mongoose.model("Auction", auctionSchema);

Auction.processErrors = (err) => {
  let msg = {};
  for (let key in err.errors) {
    msg[key] = err.errors[key].message;
  }
  return msg;
};

module.exports = Auction;
