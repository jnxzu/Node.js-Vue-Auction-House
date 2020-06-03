const mongoose = require("../config/mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
  },
});

const chatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [messageSchema],
});

const uniqueValidator = require("mongoose-unique-validator");
chatSchema.plugin(uniqueValidator);

const Chat = mongoose.model("Chat", chatSchema);

Chat.processErrors = (err) => {
  let msg = {};
  for (let key in err.errors) {
    msg[key] = err.errors[key].message;
  }
  return msg;
};

module.exports = Chat;
