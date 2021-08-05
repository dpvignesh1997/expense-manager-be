const { Client } = require('pg');

const HOST = process.env.PG_HOST;
const PORT = process.env.PG_PORT;
const DATABASE = process.env.PG_DATABASE;
const USER = process.env.PG_USER;
const PASSWORD = process.env.PG_PASSWORD;


// PostgreSQL Client
const client = new Client({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
    ssl: false
})

module.exports = client;