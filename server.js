require('dotenv').config();

const express = require('express');
const expressGraphQL = require('express-graphql');
const cors = require('cors');

const schema = require('./schema');

const app = express();

app.use(cors());

app.use(
  '/',
  expressGraphQL({
    schema,
    graphiql: true
  })
);

const port = 5000 || process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
