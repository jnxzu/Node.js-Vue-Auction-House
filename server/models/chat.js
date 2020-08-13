const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('../config/mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
  },
});

const chatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
});

chatSchema.plugin(uniqueValidator);

const Chat = mongoose.model('Chat', chatSchema);

Chat.processErrors = (err) => {
  const msg = {};
  for (const key in err.errors) {
    msg[key] = err.errors[key].message;
  }
  return msg;
};

module.exports = Chat;
