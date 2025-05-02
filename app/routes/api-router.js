const express = require("express");
const apiRouter = express.Router();

const topicsRouter = require("./topics.router.js");
const articlesRouter = require("./articles.router.js");
const commentsRouter = require("./comments.router.js");
const usersRouter = require("./users.router.js");
const { getApi } = require("../controllers/controller.js");

apiRouter.route("/").get(getApi);
apiRouter.use("/topics",topicsRouter);
apiRouter.use("/articles",articlesRouter);
apiRouter.use("/comments",commentsRouter);
apiRouter.use("/users",usersRouter);

module.exports = apiRouter;
