const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { Pool } = require("pg");

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect()
    .then(() => {
        console.log(`Connected to the database: ${process.env.DATABASE}`);
    })
    .catch((err) => {
        console.error("Error connecting to the database", err.stack);
    });

module.exports = db;
