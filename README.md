# NC News Seeding

## Set Up

1. Clone the repo
    - git clone https://github.com/niicraymond/northcoders-news-BE.git 

2. Install dependencies 
    - npm install

3. Create the environment files:

- .env.development
    - PGDATABASE=nc_news

- .env.test
    - PGDATABASE=nc_news_test

4. Set up the databases:
    - npm run setup-dbs

5. Seed the development database:
    - NODE_ENV=development npm run seed-dev

6. Run tests:
    - npm test