const db = require("../../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT slug, description FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      return result.rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `
    SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectCommentsByArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article comments not found",
        });
      }
      return result.rows;
    });
};

exports.insertCommentOnArticle = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      if (err.code === "23503") {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return Promise.reject(err);
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,[
        inc_votes, article_id
      ]
    )
    .then((result) => {

      if(result.rows.length === 0){
        return Promise.reject({status: 404, msg: "Article not found"})
      }

      return result.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]).then((result) => {
    if (result.rowCount === 0){
      return Promise.reject({status: 404 ,msg:'Comment not found'})
    }
  })
}