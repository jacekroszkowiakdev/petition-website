const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
    override: true,
});

const { Pool } = require("pg");

const db = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT || 5432,
});

db.connect((err, client, release) => {
    if (err) {
        return console.error("Error acquiring client", err.stack);
    }
    console.log("Connected to the petitiondb");
    release();
});

module.exports = db;
