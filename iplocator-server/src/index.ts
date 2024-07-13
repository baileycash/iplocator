import express from "express";
import logger from "./lib/logger";
var indexRouter = require("./routes/index");

var app = express();
const port = 3000;
app.use(logger(":method :status :res[content-length] - :response-time ms"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});

module.exports = app;
