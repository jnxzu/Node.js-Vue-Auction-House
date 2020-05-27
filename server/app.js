const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("./config/socket.io")(io); // socket.io config

const routes = require("./config/routes"); // routing config

app.use(bodyParser.json());
app.use(routes);

app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/img", express.static(path.join(__dirname, "public/img")));

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
