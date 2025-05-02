const endpoints = require("../../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommentsByArticle,
  insertCommentOnArticle,
  updateArticleVotes,
  removeCommentById,
  selectUsers,
  selectUsersByUsername, updateCommentVotes
} = require("../models/model.js");

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const {order, sort_by, topic} = req.query
  return selectArticles(order, sort_by, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  return selectCommentsByArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return insertCommentOnArticle(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return removeCommentById(comment_id)
    .then((comment) => {
      res.status(204).end();
    })
    .catch(next);
};

exports.getUsers = (req,res,next) => {
  return selectUsers().then((users) => {
    res.status(200).send({users})
  }).catch(next)
}

exports.getUsersByUsername = (req,res,next) => {
  const {username} = req.params
  return selectUsersByUsername(username).then((user) => {
    res.status(200).send({user})
  }).catch(next)
}

exports.patchCommentVotes = (req, res, next) => {
  const {comment_id} = req.params
  const {inc_votes} = req.body
  return updateCommentVotes(comment_id, inc_votes).then((comment) => {
    res.status(200).send({comment})
  }).catch(next)
}