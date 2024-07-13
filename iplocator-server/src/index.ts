import express from "express";
import logger from "./lib/logger";
var indexRouter = require("./routes/index");

var app = express();
const port = 3000;
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`App running`);
});

module.exports = app;
