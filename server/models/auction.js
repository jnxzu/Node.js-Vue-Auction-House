const mongoose = require("../config/mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  host: {
    type: Schema.ObjectId,
    ref: "User",
  },
  item: { type: String },
  price: { type: Number },
  topBid: {
    type: Schema.ObjectId,
    ref: "User",
  },
  expiry: {
    type: Date,
  },
  finished: {
    type: Boolean,
  },
  fast: {
    type: Boolean,
  },
  allBids: [{ type: Schema.ObjectId, ref: "User" }],
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
