const express = require("express");
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  getCommentsByArticle,
  postCommentOnArticle,
} = require("../controllers/controller");

const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes)
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postCommentOnArticle);

module.exports = articlesRouter;
