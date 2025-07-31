const express = require("express");
const app = express();
const apiRouter = require('./app/routes/api-router')
const cors = require('cors')
const pool = require("./db/connection");

app.use(cors())

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

app.get("/healthz", async (_req, res) => {
  try {
    await pool.query("SELECT 1"); // touches Supabase
    return res.status(200).send("OK");
  } catch (err) {
    console.error("healthz DB check failed:", err.message);
    return res.status(500).send("DB error");
  }
});

module.exports = app