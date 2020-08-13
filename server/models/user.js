const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('../config/mongoose');

const { Schema } = mongoose;
const bcrypt = require('../config/bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
  hosting: [{ type: Schema.Types.ObjectId, ref: 'Auction' }],
  topBids: [{ type: Schema.Types.ObjectId, ref: 'Auction' }],
  allBids: [{ type: Schema.Types.ObjectId, ref: 'Auction' }],
  chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
});

userSchema.plugin(uniqueValidator);

userSchema.methods.generateHash = (password) => bcrypt.hash(password);

// eslint-disable-next-line func-names
userSchema.methods.validPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

User.processErrors = (err) => {
  const msg = {};
  for (const key in err.errors) {
    msg[key] = err.errors[key].message;
  }
  return msg;
};

module.exports = User;
