const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const hb = require("express-handlebars");
const db = require("./db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const frameguard = require("frameguard");

app.use(
    cookieSession({
        secret: `Grzegorz Brzęczyszczykiewicz`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));

app.use(csurf());
app.use(function (req, res, next) {
    res.set("x-frame-options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    frameguard({ action: "SAMEORIGIN" });
    next();
});

// template rendering engine
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use((req, res, next) => {
    console.log("-----------------");
    console.log(`${req.method} request coming in on route ${req.url}`);
    console.log("-----------------");
    next();
});

// GET /register
app.get("/register", (req, res) => {
    if (req.session.userId !== true) {
        console.log(`user is requesting GET / route from "/petition"`);
        res.render("registration", {
            title: "register",
        });
    } else res.redirect("/login");
});

// POST /register
app.post("/register", (req, res) => {
    const { first, last, email, password } = req.body;
    console.log("register body: ", req.body);
    db.addCredentials(first, last, email, password, req.session.userId)
        .then(({ rows }) => {
            req.session.userId = rows[0].id;
            req.session.registered = true;
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log("error creating user profile", err);
        });
});


//GET /login
app.get("/login", (req, res) => {
    if
});


// GET /petition
app.get("/petition", (req, res) => {
    if (req.session.signed !== true) {
        console.log(`user is requesting GET / route from "/petition"`);
        res.render("petition", {
            title: "Welcome to my petition",
        });
    } else res.redirect("/thanks");
});

// 2 POST /petition
app.post("/petition", (req, res) => {
    console.log("POST request was made - signature submitted");
    const { signature } = req.body;
    console.log("signature from DB: ", signature);
    console.log("req.session: ", req.session);
    db.addSignature(signature, req.session.userId) // change userID here to something else sessionId?
        .then(({ rows }) => {
            req.session.signed = true;
            req.session.signatureId = rows[0].id; // saves id of row into session ...
            console.log("req.session after setting ID: ", req.session);
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("POST/petition error writing to DataBase: ", err);
        });
});

// 3 GET /thanks
app.get("/thanks", (req, res) => {
    if (req.session.signed !== true) {
        res.redirect("/petition");
    } else {
        return Promise.all([
            db.getSignaturePic(req.session.userId),
            db.getSignatoriesNumber(),
        ])
            .then((result) => {
                let signature = result[0].rows[0].signature;
                console.log("signature from DB: ", signature);
                let count = result[1].rows[0].count;
                console.log("count :", count);
                res.render("thanks", {
                    title: "Thank you for signing",
                    count,
                    signature,
                });
            })
            .catch((err) => {
                console.log("error reading data from DB : ", err);
            });
    }
});

// 4 GET /signers
app.get("/signers", (req, res) => {
    if (req.session.signed !== true) {
        res.redirect("/petition");
    } else
        db.getSignatories().then(({ rows }) => {
            res.render("signers", {
                title: "Petition signatories",
                rows,
            }).catch((err) => {
                console.log("error reading signatories form DB : ", err);
            });
        });
});

app.listen(8080, () =>
    console.log("Petition test server listening on port 8080")
);
