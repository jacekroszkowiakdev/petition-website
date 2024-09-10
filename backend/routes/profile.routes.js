const express = require("express");
const router = express.Router();
const {
    requireLoggedOut,
    requireLoggedIn,
    requireUnsignedPetition,
} = require("../middleware/routesLogic.middleware");
const { hashPassword } = require("../utils/passwordUtils/bcrypt");
const {
    registerUser,
    addUserData,
    getUserData,
} = require("../services/services");
const db = require("../db");

// register
router.get("/register", requireLoggedOut, (req, res) => {
    res.render("registration", {
        title: "Sign Up",
        userLoggedOut: true,
    });
});

router.post("/register", requireLoggedOut, async (req, res) => {
    const { first, last, email, password } = req.body;

    try {
        const user = await registerUser(first, last, email, password);
        req.session.userId = user.id;
        req.session.name = user.first;
        res.redirect("/profile");
    } catch (err) {
        res.render("registration", {
            title: "register",
            userLoggedOut: true,
            error: true,
            message: err.message || "Error creating user profile.",
        });
    }
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
    async (req, res) => {
        const { age, city, homepage } = req.body;
        const userId = req.session.userId;

        try {
            await addUserData(age, city, homepage, userId);
            res.redirect("/petition");
        } catch (err) {
            res.render("profile", {
                title: "profile",
                error: true,
                message: err.message || "Error saving user data.",
            });
        }
    }
);

// edit
router.get("/edit", requireLoggedIn, async (req, res) => {
    const userId = req.session.userId;
    const userName = req.session.name;

    try {
        const userData = await getUserData(userId);
        res.render("edit", {
            title: "Edit your profile",
            userData,
            name: userName,
        });
    } catch (err) {
        res.render("edit", {
            title: "Edit your profile",
            error: true,
            message: err.message || "Error fetching user data.",
        });
    }
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
