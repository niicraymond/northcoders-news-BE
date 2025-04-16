const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");
const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments, articles, users, topics`)
    .then(() => {
      return db.query(
        `CREATE TABLE topics(
          slug VARCHAR PRIMARY KEY,
          description VARCHAR NOT NULL,
          img_url VARCHAR(1000)
        );`
      );
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users(
          username VARCHAR UNIQUE PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles(
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          topic VARCHAR NOT NULL REFERENCES topics(slug),
          author VARCHAR NOT NULL REFERENCES users(username),
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments(
          comment_id SERIAL PRIMARY KEY,
          article_id INT NOT NULL REFERENCES articles(article_id), 
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          author VARCHAR NOT NULL REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });

      const insertTopics = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L`,
        formattedTopics
      );

      return db.query(insertTopics);
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });

      const insertUsers = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L`,
        formattedUsers
      );

      return db.query(insertUsers);
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        const converted = convertTimestampToDate(article);
        return [
          converted.title,
          converted.topic,
          converted.author,
          converted.body,
          converted.created_at,
          converted.votes,
          converted.article_img_url,
        ];
      });

      const insertArticles = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles
      );

      return db.query(insertArticles);
    })
    .then((result) => {
      const articleRefObject = createRef(result.rows);
      const formattedComments = commentData.map((comment) => {
        const legitComment = convertTimestampToDate(comment);
        return [
          articleRefObject[comment.article_title],
          legitComment.body,
          legitComment.votes,
          legitComment.author,
          legitComment.created_at
        ];
      });

      const insertComments = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
        formattedComments
      );

      return db.query(insertComments);
    });
};
module.exports = seed;
