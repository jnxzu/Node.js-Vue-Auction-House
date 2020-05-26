const express = require("express");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");

const app = express();
const mongoose = require("./mongoose");

app.use(bodyParser.json());
app.use(serveStatic("../src/public"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Started server on port ${port}`));
