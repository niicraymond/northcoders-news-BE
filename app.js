const express = require("express");
const app = express();
const apiRouter = require('./app/routes/api-router')

app.use(express.json())

app.use("/api", apiRouter)

app.all("/*splat", (req, res) => {
  res.status(404).json({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err)
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app