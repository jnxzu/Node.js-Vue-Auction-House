const dotenv = require("dotenv");
const mongoose = require("mongoose");
const moment = require("moment");

dotenv.config();

mongoose.set("useFindAndModify", false);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

const db = mongoose.connection;

db.on("open", () => {
  console.log(
    `${moment().format(
      "MMMM Do YYYY, h:mm:ss a"
    )} - Database connection established.`
  );
});

db.on("error", console.error.bind(console, "MongoDB error: "));

module.exports = mongoose;
