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

exports.selectArticles = (order = "desc", sort_by = "created_at") => {
  const validSortColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];
 
 
  if (!validSortColumns.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
 
 
  const queryStr = `
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
  LEFT JOIN comments
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};`;
 
 
  return db.query(queryStr).then((result) => {
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

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows
  })
}