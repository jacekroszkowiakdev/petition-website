const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const hb = require("express-handlebars");
const db = require("./db");

app.use(require("cookie-parser")());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
// template rendering engine
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

// what this does exactly?
app.use((req, res, next) => {
    console.log("-----------------");
    console.log(`${req.method} request coming in on route ${req.url}`);
    console.log("-----------------");
    next();
});

// GET /petition
app.get("/petition", (req, res) => {
    if (req.cookies.signed === "true") {
        console.log("petition signed");
        res.redirect("/thanks");
    } else console.log(`user is requesting GET / route from "/"`);
    res.render("petition", {
        title: "Welcome to my petition",
    });
});

// 2 POST /petition
app.post("/petition", (req, res) => {
    console.log("POST request was made - signature submitted");
    res.cookie("authenticated", true);
    const { first, last, signature } = req.body;
    db.addSignature(first, last, "asdasdaas")
        .then(() => {
            res.cookie("signed", true);
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("error writing to DataBase: ", err);
        });
});

// 3 GET /thanks
app.get("/thanks", (req, res) => {
    if (req.cookies.signed === "true") {
        console.log("GET route to thank you page");
        res.render("thanks", {
            title: "Thank you",
        });
    } else res.redirect("/petition");
});

// 4 GET /signers
app.get("/signers", (req, res) => {
    if (req.cookies.signed === "true") {
        // SELECT first and last values of every person that has signed from
        // the database and pass them to signers.handlebars
        db.getSignatories(first, last).then(({ rows }) => {
            console.log("signatories read from DB successful", rows);
            res.render("signers", {
                title: "Petition signatories",
            }).catch((err) => {
                console.log("error reading singatories form DB : ", err);
            });
        });

        // SELECT the number of people that have signed the petition from the db →
        // I recommend looking into what COUNT can do for you here ;)
    } else res.redirect("/petition");
});

app.get("/cities", (req, res) => {
    db.getCities()
        .then(({ rows }) => {
            console.log("result from getCities:", rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log("error in db.getCities", err);
        });
});

app.listen(8080, () =>
    console.log("Petition test server listening on port 8080")
);
