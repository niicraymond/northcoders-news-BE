const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
require("jest-sorted");
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects with a slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics.length).toBeGreaterThan(0);
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: Responds with a 404 error if given an incorrect path", () => {
    return request(app)
      .get("/api/incorrectpath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct article when given a path with an article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: Responds with a 400 error if given an invalid id ", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: responds with a 404 error if given a valid id that doesnt exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an articles array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: responds with articles in decending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("404: Responds with a 404 error if given an incorrect path", () => {
    return request(app)
      .get("/api/invalidpath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
    describe("/api/articles?sort_by=?&order=?", () => {
      test("200: defaults to sorting by created_at in descending order when no queries are given", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            const articles = response.body.articles;
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("200: sorts articles by column name when query params are given", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then((response) => {
            const articles = response.body.articles;
            expect(articles).toBeSortedBy("title", { descending: true });
          });
      });
      test("200: orders articles in acending order when parmas are given", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then((response) => {
            const articles = response.body.articles;
            expect(articles).toBeSortedBy("author", { ascending: true });
          });
      });
      test("200: orders articles in descending order when parmas are given", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=desc")
          .expect(200)
          .then((response) => {
            const articles = response.body.articles;
            expect(articles).toBeSortedBy("author", { descending: true });
          });
      });
      test("400: returns 400 if given an invalid sort_by", () => {
        return request(app)
          .get("/api/articles?sort_by=invalidcolumn")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad request");
          });
      });
      test("400: returns 400 if given an invalid order", () => {
        return request(app)
          .get("/api/articles?order=invalidorder")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad request");
          });
      });
    });
    describe("/api/articles?topic=?", () => {
      test("200: filters articles by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then((response) => {
            const articles = response.body.articles;
            expect(articles.length).toBeGreaterThan(0);
            articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
          });
      });
    
      test("404: returns 404 if the topic does not exist", () => {
        return request(app)
          .get("/api/articles?topic=notarealtopic")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Topic not found");
          });
      });
    });
    
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of all comments from an article with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("200: Comments should be served with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("400: Responds with a 400 error if given an invalid id", () => {
    return request(app)
      .get("/api/articles/invalidid/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: responds with a 404 error if given a valid id that doesnt exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article comments not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: posts a comment to a specific article", () => {
    const newComment = {
      username: "butter_bridge",
      body: "nicolescomment",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 1,
          body: "nicolescomment",
          votes: expect.any(Number),
          author: "butter_bridge",
          created_at: expect.any(String),
        });
      });
  });
  test("404: responds with a 404 if given a valid id that doesnt exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "nicolescomment",
    };

    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("400: responds with a 400 when given an invalid id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "nicolescomment",
    };

    return request(app)
      .post("/api/articles/invalidid/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates an article by article_id when inc_votes is positive", () => {
    const votesObject = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/1")
      .send(votesObject)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 110,
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: updates an article by article_id when inc_votes is negative", () => {
    const votesObject = { inc_votes: -10 };

    return request(app)
      .patch("/api/articles/1")
      .send(votesObject)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 90,
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: responds with a 404 if given a valid id that doesnt exist", () => {
    const votesObject = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/9999")
      .send(votesObject)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });

  test("400: responds with a 400 when given an invalid id", () => {
    const votesObject = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/invalidid")
      .send(votesObject)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with a 400 if inc_votes is not a number", () => {
    const votesObject = { inc_votes: "notanumber" };

    return request(app)
      .patch("/api/articles/1")
      .send(votesObject)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: delete the given comment by comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: responds with a 404 if given a valid id that doesnt exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found");
      });
  });
  test("400: responds with a 400 when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/invalidid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users.length).toBeGreaterThan(0);
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: Responds with a 404 error if given an incorrect path", () => {
    return request(app)
      .get("/api/incorrectpath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
});
