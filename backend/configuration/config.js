const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { Pool } = require("pg");

console.log("Environment Variables:", {
    USER: process.env.DB_USER,
    HOST: process.env.DB_HOST,
    DATABASE: process.env.DATABASE,
    PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
});

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // user: "petition_user",
    // host: "localhost",
    // database: "petitiondb",
    // password: "SuperSecret",
    // port: 5432,
});

db.connect()
    .then(() => {
        console.log(`Connected to the database: ${process.env.DATABASE}`);
    })
    .catch((err) => {
        console.error("Error connecting to the database", err.stack);
    });

module.exports = db;
