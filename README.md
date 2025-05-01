# NC News API

This is a RESTful API for a news application, built with Node.js, Express, and PostgreSQL. This API provides access to articles, topics, users, and comments, and supports all necessary CRUD operations.

Live API: https://northcoders-news-be-s4h6.onrender.com

To run the project:

1. Clone the repository:
git clone https://github.com/niicraymond/northcoders-news-BE.git
cd northcoders-news-BE

2. Install dependencies:
npm install

3. Create the environment files in the root of the project:

.env.development  
PGDATABASE=nc_news

.env.test  
PGDATABASE=nc_news_test

4. Set up the databases:
npm run setup-dbs

5. Seed the development database:
npm run seed-dev

6. Seed the test database:
npm run seed-test

7. Run the test suite:
npm test

Minimum required versions:
Node.js: v22.0.0  
PostgreSQL: v14+

- See the `/api` endpoint for full documentation.
