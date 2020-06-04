const mongoose = require("mongoose");
const moment = require("moment");

mongoose.set("useFindAndModify", false);

(async () => {
  try {
    await mongoose.connect("mongodb://localhost/auctionhouse", {
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
