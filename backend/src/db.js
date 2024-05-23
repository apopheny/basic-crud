const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

// PostgreSQL connection
const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
});

// MongoDB connection
const mongoClient = new MongoClient(
  'mongodb://myuser:mypassword@localhost:27017/mydatabase'
);

module.exports = { pool, mongoClient };
