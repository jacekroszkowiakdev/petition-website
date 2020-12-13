const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const frameguard = require("frameguard");

// Middleware:

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

app.use((req, res, next) => {
    console.log("-----------------");
    console.log(`${req.method} request coming in on route ${req.url}`);
    console.log("-----------------");
    next();
});

// template rendering engine
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

// Middleware for routes logic:

const {
    requireLoggedIn,
    requireLoggedOut,
    requireSignedPetition,
    requireUnsignedPetition,
} = require("./middleware");

// Routes:

// GET "/"
app.get("/", (req, res) => {
    res.redirect("/register");
});

// GET /register
app.get("/register", requireLoggedOut, (req, res) => {
    res.render("registration", {
        title: "register",
        userLoggedOut: true,
    });
});

// POST /register
app.post("/register", requireLoggedOut, (req, res) => {
    const { first, last, email, password } = req.body;
    console.log("register body: ", req.body);
    hash(password)
        .then((hashedPassword) => {
            db.addCredentials(
                first,
                last,
                email,
                hashedPassword,
                req.session.userId
            )
                .then(({ rows }) => {
                    console.log("New user added to table users");
                    req.session.userId = rows[0].id;
                    req.session.name = rows[0].first;
                    res.redirect("/profile");
                })
                .catch((err) => {
                    console.log("error creating user profile", err);
                    res.render("registration", {
                        title: "register",
                        userLoggedOut: true,
                        name: req.session.name,
                        message:
                            "You made an error while creating your user profile, please fill required fields again and submit to register",
                    });
                });
        })
        .catch((err) => {
            console.log("error creating user profile", err);
            res.render("registration", {
                title: "register",
                userLoggedOut: true,
                message:
                    "You made an error while creating your user profile, please fill required fields again and submit to register",
            });
        });
});

// GET /profile
app.get("/profile", requireLoggedIn, requireUnsignedPetition, (req, res) => {
    res.render("profile", {
        title: "profile",
    });
});

//POST /profile
app.post("/profile", requireLoggedIn, requireUnsignedPetition, (req, res) => {
    const { age, city, homepage } = req.body;
    if (
        homepage.startsWith("http://") ||
        homepage.startsWith("https://") ||
        homepage === ""
    ) {
        db.addProfile(
            age,
            city.toLowerCase(),
            homepage.toLowerCase(),
            req.session.userId
        )
            .then(() => {
                console.log("User profile added do DB");
                res.redirect("/petition");
            })
            .catch((err) => {
                console.log("Profile write to DB failed", err);
                res.render("profile", {
                    title: "profile",
                    message: "Something went wrong, please try again.",
                });
            });
    } else {
        res.render("profile", {
            title: "profile",
            message: "Please fill the fields again",
        });
    }
});

// GET /edit
app.get("/edit", requireLoggedIn, (req, res) => {
    console.log("all user data loaded from DB");
    db.getCombinedUserData(req.session.userId)
        .then(({ rows }) => {
            res.render("edit", {
                title: "Edit your profile",
                rows,
                name: req.session.name,
            });
        })
        .catch((err) => {
            console.log("error loading cross-table user data", err);
        });
});

// POST /edit
app.post("/edit", requireLoggedIn, (req, res) => {
    const { first, last, email, password, age, city, homepage } = req.body;
    if (password !== "") {
        hash(password)
            .then((hashedPassword) => {
                db.updateCredentials(
                    first,
                    last,
                    email,
                    hashedPassword,
                    req.session.userId
                )
                    .then(() => {
                        console.log("Users table updated");
                    })
                    .then(() => {
                        //EXPORT FUNCTION UPSERT HERE
                        if (
                            homepage.startsWith("http://") ||
                            homepage.startsWith("https://") ||
                            homepage == ""
                        ) {
                            db.upsertProfile(
                                age,
                                city.toLowerCase(),
                                homepage.toLowerCase(),
                                req.session.userId
                            )
                                .then(() => {
                                    console.log("User profiles table updated");
                                    res.redirect("/edit");
                                })
                                .catch((err) =>
                                    console.log(
                                        "Error while updating user profile",
                                        err
                                    )
                                );
                        } else {
                            res.redirect("/edit");
                        }
                    })
                    .catch((err) =>
                        console.log("Error while updating user profile", err)
                    );
            })
            .catch((err) => {
                console.log("Error while updating user profile", err);
                res.render("edit", {
                    title: "edit",
                    message:
                        "Something went wrong- please fill the fields again",
                });
            });
    } else {
        db.updateWithOldPassword(req.session.userId, first, last, email)
            .then(() => {
                console.log("Profile updated, user keeps password");
            })
            .then(() => {
                //EXPORT FUNCTION UPSERT HERE
                if (
                    homepage.startsWith("http://") ||
                    homepage.startsWith("https://") ||
                    homepage == ""
                ) {
                    db.upsertProfile(
                        age,
                        city.toLowerCase(),
                        homepage.toLowerCase(),
                        req.session.userId
                    )
                        .then(() => {
                            console.log("User profiles table updated");
                            res.redirect("/edit");
                        })
                        .catch((err) =>
                            console.log(
                                "Error while updating user profile",
                                err
                            )
                        );
                } else {
                    res.redirect("/edit");
                }
            })
            .catch((err) =>
                console.log("Error while updating user profile", err)
            );
    }
});

//GET /login
app.get("/login", requireLoggedOut, (req, res) => {
    res.render("login", {
        title: "login",
        userLoggedOut: true,
    });
});

//POST /login
app.post("/login", requireLoggedOut, (req, res) => {
    const { email, password } = req.body;
    db.checkForUserEmail(email)
        .then(({ rows }) => {
            console.log("typedPass: ", password);
            console.log("db stored Pass", rows[0].password);
            compare(password, rows[0].password).then(({ result }) => {
                if (result) {
                    console.log("Result: ", result);
                    console.log("req.session.userId", req.session.userId);
                    req.session.userId = rows[0].id;
                    db.checkForUserSignature(rows[0].id)
                        .then(({ rows }) => {
                            if (rows.length > 0) {
                                req.session.signatureId = rows[0].id;
                                res.redirect("/thanks");
                            } else res.redirect("/petition");
                        })
                        .catch((err) => {
                            console.log("signature not in DB", err);
                            res.render("login", {
                                title: "login",
                                message:
                                    "You have entered incorrect login or password.",
                            });
                        });
                } else {
                    console.log("error in compare");
                    res.render("login", {
                        title: "login",
                        userLoggedOut: true,
                        message:
                            "No match was found for the credentials you have entered",
                    });
                }
            });
        })
        .catch((err) => {
            console.log("passwords don't match", err);
            res.render("login", {
                title: "login",
                userLoggedOut: true,
                message: "You have entered incorrect login or password.",
            });
        });
});

//GET /logout
app.get("/logout", requireLoggedIn, (req, res) => {
    req.session = null;
    res.render("logout", {
        title: "logout",
    });
});

// GET /petition
app.get("/petition", requireLoggedIn, requireUnsignedPetition, (req, res) => {
    console.log(`user is requesting GET / route from "/petition"`);
    res.render("petition", {
        title: "Welcome to my petition",
    });
});

// POST /petition
app.post("/petition", requireLoggedIn, requireUnsignedPetition, (req, res) => {
    const { signature } = req.body;
    db.addSignature(signature, req.session.userId)
        .then(({ rows }) => {
            req.session.signatureId = rows[0].id;
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("POST/petition error writing to DataBase: ", err);
        });
});

// GET /thanks
app.get("/thanks", requireLoggedIn, requireSignedPetition, (req, res) => {
    return Promise.all([
        db.getSignaturePic(req.session.signatureId),
        db.getSignatoriesNumber(),
    ])
        .then((result) => {
            let signature = result[0].rows[0].signature;
            let count = result[1].rows[0].count;
            res.render("thanks", {
                title: "Thank you for signing",
                count,
                signature,
            });
        })
        .catch((err) => {
            console.log("error reading data from DB : ", err);
        });
});

//POST / thanks
app.post("/thanks", requireLoggedIn, requireSignedPetition, (req, res) => {
    db.deleteSignature(req.session.userId)
        .then(() => {
            req.session.signatureId = null;
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log("error while attempt to delete signature from DB", err);
        });
});

// GET /signers
app.get("/signers", requireLoggedIn, requireSignedPetition, (req, res) => {
    db.getSignatories()
        .then(({ rows }) => {
            // for (let i = 0; i < rows.length; i++) {
            //     let city = rows[i].city;
            //     city = city.charAt(0).toUpperCase() + city.substring(1);
            // }

            res.render("signers", {
                title: "Petition signatories",
                rows,
            });
        })
        .catch((err) => {
            console.log("error reading signatories form DB : ", err);
        });
});

//GET signers//city
app.get(
    "/signers/:city",
    requireLoggedIn,
    requireSignedPetition,
    (req, res) => {
        let city = req.params.city;
        db.getSignatoriesByCity(city)
            .then(({ rows }) => {
                res.render("signers", {
                    title:
                        req.params.city.charAt(0).toUpperCase() +
                        req.params.city.substring(1),
                    rows,
                });
            })
            .catch((err) => {
                console.log("error reading signatories/cities form DB : ", err);
            });
    }
);

app.listen(process.env.PORT || 8080, () =>
    console.log("Petition test server listening on port 8080")
);
