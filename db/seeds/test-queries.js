const db = require("../connection");

// Get all of the users
db.query(`SELECT * FROM users`).then((result) => {
  console.log("All Users", result.rows);
});
//Get all of the articles where the topic is coding
db.query(`SELECT * FROM articles WHERE topic = 'coding'`).then((result) => {
  console.log("All coding articles", result.rows);
});
// Get all of the comments where the votes are less than zero
db.query(`SELECT * FROM comments WHERE votes < 0`).then((result) => {
  console.log("comments with less than 0 votes", result.rows);
});
// Get all of the topics
db.query(`SELECT * FROM topics`).then((result) => {
  console.log("All topics", result.rows);
});
//Get all of the articles by user grumpy19
db.query(`SELECT * FROM articles WHERE author = 'grumpy19'`).then((result) => {
  console.log("grumpy19 articles", result.rows);
});
// Get all of the comments that have more than 10 votes.
db.query(`SELECT * FROM comments WHERE votes > 10`).then((result) => {
  console.log("comments with more than 10 votes", result.rows);
});
