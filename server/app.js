const express = require("express");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const server = require("./config/https")(app);

const io = require("socket.io")(server);
require("./config/socket.io")(io); // socket.io config

const routes = require("./config/routes"); // routing config

app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: "secretive",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/img", express.static(path.join(__dirname, "public/img")));

const port = 3000;

server.listen(port, () => {
  console.log(`Server live: https://localhost:${port}`);
});
