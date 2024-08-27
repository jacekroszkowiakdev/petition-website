const express = require("express");
const router = express.Router();
const {
    requireLoggedOut,
    requireLoggedIn,
    requireUnsignedPetition,
} = require("../middleware/routesLogic.middleware");
const { hashPassword } = require("../utils/passwordUtils/bcrypt");
const db = require("../db");

// register
router.get("/register", requireLoggedOut, (req, res) => {
    res.render("registration", {
        title: "Sign Up",
        userLoggedOut: true,
    });
});

router.post("/register", requireLoggedOut, (req, res) => {
    const { first, last, email, password } = req.body;
    hashPassword(password)
        .then((hashedPassword) => {
            db.addCredentials(
                first,
                last,
                email,
                hashedPassword,
                req.session.userId
            )
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    req.session.name = rows[0].first;
                    res.redirect("/profile");
                })
                .catch((err) => {
                    res.render("registration", {
                        title: "register",
                        userLoggedOut: true,
                        error: true,
                        message: "Error creating user profile.",
                    });
                });
        })
        .catch((err) => {
            res.render("registration", {
                title: "register",
                userLoggedOut: true,
                error: true,
                message: "Error creating user profile.",
            });
        });
});

// profile
router.get("/profile", requireLoggedIn, requireUnsignedPetition, (req, res) => {
    res.render("profile", {
        title: "profile",
    });
});

router.post(
    "/profile",
    requireLoggedIn,
    requireUnsignedPetition,
    (req, res) => {
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
                    res.redirect("/petition");
                })
                .catch((err) => {
                    res.render("profile", {
                        title: "profile",
                        error: true,
                        message: "Something went wrong, please try again.",
                    });
                });
        } else {
            res.render("profile", {
                title: "profile",
                message: "Please fill the fields again",
            });
        }
    }
);

// edit profile
router.get("/edit", requireLoggedIn, (req, res) => {
    db.getCombinedUserData(req.session.userId)
        .then(({ rows }) => {
            res.render("edit", {
                title: "Edit your profile",
                rows,
                name: req.session.name,
            });
        })
        .catch((err) => {
            res.status(500).send("Internal Server Error");
        });
});

router.post("/edit", requireLoggedIn, (req, res) => {
    const { first, last, email, password, age, city, homepage } = req.body;
    if (password !== "") {
        hashPassword(password)
            .then((hashedPassword) => {
                db.updateCredentials(
                    first,
                    last,
                    email,
                    hashedPassword,
                    req.session.userId
                )
                    .then(() => {
                        if (
                            homepage.startsWith("http://") ||
                            homepage.startsWith("https://") ||
                            homepage === ""
                        ) {
                            db.upsertProfile(
                                age,
                                city.toLowerCase(),
                                homepage.toLowerCase(),
                                req.session.userId
                            )
                                .then(() => {
                                    res.redirect("/edit");
                                })
                                .catch((err) => {
                                    res.render("edit", {
                                        title: "edit",
                                        error: true,
                                        message:
                                            "Something went wrong- please fill the fields again",
                                    });
                                });
                        } else {
                            res.redirect("/edit");
                        }
                    })
                    .catch((err) => {
                        res.render("edit", {
                            title: "edit",
                            error: true,
                            message:
                                "Something went wrong- please fill the fields again",
                        });
                    });
            })
            .catch((err) => {
                res.render("edit", {
                    title: "edit",
                    error: true,
                    message:
                        "Something went wrong- please fill the fields again",
                });
            });
    } else {
        db.updateWithOldPassword(first, last, email, req.session.userId)
            .then(() => {
                if (
                    homepage.startsWith("http://") ||
                    homepage.startsWith("https://") ||
                    homepage === ""
                ) {
                    db.upsertProfile(
                        age,
                        city.toLowerCase(),
                        homepage.toLowerCase(),
                        req.session.userId
                    )
                        .then(() => {
                            res.redirect("/edit");
                        })
                        .catch((err) => {
                            res.render("edit", {
                                title: "edit",
                                error: true,
                                message:
                                    "Something went wrong- please fill the fields again",
                            });
                        });
                } else {
                    res.redirect("/edit");
                }
            })
            .catch((err) => {
                res.render("edit", {
                    title: "edit",
                    error: true,
                    message:
                        "Something went wrong- please fill the fields again",
                });
            });
    }
});

module.exports = router;
