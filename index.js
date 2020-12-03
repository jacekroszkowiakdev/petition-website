const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const hb = require("express-handlebars");
const spicedPg = require("spiced-pg");
app.use(require("cookie-parser")());
const db = spicedPg("postgres:postgres:postgres@localhost:5432/cities");
//spicedPg("whoAreWeTalkingTo:whichDBUserWillRunMyCommands:theUserPasswordForOurDbUser@PostgrePort/nameOfDatabase")

module.exports.getCities = () => {
    const q = `SELECT * FROM cities`;
    return db.query(q);
};

module.exports.addCity = (cityName, countryName) => {
    const q = `INSERT INTO cities (city,country)
    VALUES ($1 , $2)`;
    const params = [cityName, countryName];

    return db.query(q, params);
};

module.exports.getSpicificCity = (cityName) => {
    const q = `SELECT * FROM cities
                WHERE city = $1`;
    const params = [cityName];
    return db.query(q, params);
};

// inserts are composed of INSERT INTO tableName (columnWeWantToAddValueInto, columnWeWantToAddValueInto)

// set cookie:

app.get("/cookie", (req, res) => {
    console.log("req.cookies: ", req.cookies);
    res.send(`
    <form method="POST" style="display: flex; flex-direction: column; justify-content: space-between; width: 40%; height: 50%;">
    <h1>This page uses cookies, to proceed, please confirm that you consent</h1>
    <div>
        <input type="checkbox" name="approve"><span>I approve using cookies</span>
        <input type="checkbox" name="disapprove"><span>I don't approve using cookies</span>
    </div>
    <button> Submit </submit>
    </form>`);
});

// GET /petition

//     renders petition.handlebars template
//     IF the user has already signed the petition, it redirects to /thanks (→ check your cookie for this)
//     IF user has not yet signed, it renders petition.handlebars

app.get("/petition", (req, res) => {
    if (req.cookies.signed === "true") {
        console.log("petition signed");
        res.redirect("/thanks");
    } else console.log(`user is requesting GET / route from "/"`);
    res.render("petition", {
        layout: "main", // "main" is a default layout name, so doesn't needs to be specified but keep it here for now
        title: "Welcome to my petition",
    });
});

// 2 POST /petition

app.post("/petition", (req, res) => {
    console.log("POST request was made - signature submitted");
    res.cookie("authenticated", true);
    let { signed } = req.body;
    console.log(signed);
    if (signed) {
        res.cookie("signed", true);
        res.redirect("/thanks");
    }
});

// 3 GET /thanks
app.get("/thanks", (req, res) => {
    if (req.cookies.signed === "true") {
        console.log("GET route to thank you page");
        res.render("thanks", {
            layout: "main",
            title: "Thank you",
        });
    } else res.redirect("/petition");
});

// 4 GET /signers

app.get("/signers", (req, res) => {
    if (req.cookies.signed === "true") {
        // SELECT first and last values of every person that has signed from
        // the database and pass them to signers.handlebars
        // SELECT the number of people that have signed the petition from the db →
        // I recommend looking into what COUNT can do for you here ;)
    }
});

app.listen(8080, () =>
    console.log("Petition test server listening on port 8080")
);
