const { Pool } = require("pg");

const db = new Pool({
    user: "petition_user",
    host: "localhost",
    database: "petitiondb",
    password: "SuperSecret",
    port: 5432,
});

db.connect((err, client, release) => {
    if (err) {
        return console.error("Error acquiring client", err.stack);
    }
    console.log("Connected to the database");
});

module.exports = db;
