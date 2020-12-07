const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const hb = require("express-handlebars");
const db = require("./db");
const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `Grzegorz Brzęczyszczykiewicz`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));

// template rendering engine
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use((req, res, next) => {
    console.log("-----------------");
    console.log(`${req.method} request coming in on route ${req.url}`);
    console.log("-----------------");
    next();
});

// GET /petition
app.get("/petition", (req, res) => {
    if (req.session.signed !== true) {
        console.log(`user is requesting GET / route from "/"`);
        res.render("petition", {
            title: "Welcome to my petition",
        });
    } else res.redirect("/thanks");
});

// 2 POST /petition
app.post("/petition", (req, res) => {
    console.log("POST request was made - signature submitted");
    const { first, last, signature } = req.body;
    console.log("req.session: ", req.session);
    db.addSignature(first, last, signature, req.session.userId)
        .then(({ rows }) => {
            req.session.signed = true;
            req.session.userId = rows[0].id; // saves id of row into session ...
            console.log("req.session after setting ID: ", req.session);
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("error writing to DataBase: ", err);
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
            .then((rows) => {
                res.render("thanks", {
                    title: "Thank you",
                    signature: rows[0].signature,
                    count: rows[0].count,
                });
            })
            .catch((err) => {
                console.log("error reading data from DB : ", err);
            });
    }
});

// app.get("/thanks", (req, res) => {
//     if (req.session.signed !== true) {
//         res.redirect("/petition");
//     } else
//         db.getSignaturePic(req.session.id)
//             .then(({ rows }) => {
//                 console.log("rows", rows[0]);
//                 // const signature = rows[0].signature;
//                 db.getSignatoriesNumber().then(({ rows }) => {
//                     const count = rows[0].count;
//                     res.render("thanks", {
//                         title: "Thank you",
//                         count,
//                         signature,
//                     }).catch((err) => {
//                         console.log(
//                             "error reading signatories number form DB : ",
//                             err
//                         );
//                     });
//                 });
//             })
//             .catch((err) => {
//                 console.log("error reading signature pic from DB : ", err);
//             });
// });

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
