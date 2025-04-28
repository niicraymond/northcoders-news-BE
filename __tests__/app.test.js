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
  test.skip("404: Responds a 404 error if given an incorrect path", () => {
    return request(app)
    .get("/api/incorrectpath")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Path not found")
    })
  })
})