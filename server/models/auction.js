const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('../config/mongoose');

const { Schema } = mongoose;

const auctionSchema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  item: { type: String, unique: true, minlength: 2 },
  price: { type: Number, min: 1 },
  topBid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  expiry: {
    type: Date,
  },
  finished: {
    type: Boolean,
  },
  quickbuy: {
    type: Boolean,
  },
  allBids: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

auctionSchema.plugin(uniqueValidator);

const Auction = mongoose.model('Auction', auctionSchema);

Auction.processErrors = (err) => {
  const msg = {};
  for (const key in err.errors) {
    msg[key] = err.errors[key].message;
  }
  return msg;
};

module.exports = Auction;
