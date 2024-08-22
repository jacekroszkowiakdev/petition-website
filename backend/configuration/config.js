require("dotenv").config();
dotenv.config();

console.log("PORT:", process.env.PORT);

const { Pool } = require("pg");

const db = new Pool({
    // user: "petition_user",
    // host: "localhost",
    // database: "petitiondb",
    // password: "SuperSecret",
    // port: 5432,
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
});

db.connect((err, client, release) => {
    if (err) {
        return console.error("Error acquiring client", err.stack);
    }
    console.log("Connected to the petitiondb");
});

module.exports = db;
