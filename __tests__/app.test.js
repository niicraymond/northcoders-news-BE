const endpointsJson = require("../endpoints.json");
const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})


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
      const topics = response.body.topics
      expect(Array.isArray(topics)).toBe(true)
      topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String)
        })
      })
    })
  })
  test("404: Responds with a 404 error if given an incorrect path", () => {
    return request(app)
    .get("/api/incorrectpath")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Path not found")
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct article when given a path with an article id", () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((response) => {
      const article = response.body.article
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
    })
  })
  test("400: Responds with a 400 error if given an invalid id ", () => {
    return request(app)
    .get('/api/articles/notanumber')
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request")
    })
  })
  test("404: responds with a 400 error if given a valid id that doesnt exist", () => {
    return request(app)
    .get('/api/articles/9999')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Article not found")
    })
  })
})