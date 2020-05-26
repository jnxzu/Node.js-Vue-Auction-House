const mongoose = require("../config/mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../config/bcrypt");

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
});

const uniqueValidator = require("mongoose-unique-validator");
userSchema.plugin(uniqueValidator);

userSchema.methods.generateHash = function (password) {
  return bcrypt.hash(password);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

User.processErrors = (err) => {
  let msg = {};
  for (let key in err.errors) {
    msg[key] = err.errors[key].message;
  }
  return msg;
};

module.exports = User;
