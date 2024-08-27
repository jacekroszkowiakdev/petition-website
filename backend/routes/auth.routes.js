const express = require("express");
const router = express.Router();
const {
    requireLoggedOut,
    requireLoggedIn,
} = require("../middleware/routesLogic.middleware");
const { comparePasswords } = require("../utils/passwordUtils/bcrypt");
const db = require("../db");

// Login
router.get("/login", requireLoggedOut, (req, res) => {
    res.render("login", {
        title: "login",
        userLoggedOut: true,
    });
});

router.post("/login", requireLoggedOut, (req, res) => {
    const { email, password } = req.body;
    db.checkForUserEmail(email)
        .then(({ rows }) => {
            comparePasswords(password, rows[0].password).then((result) => {
                if (result) {
                    req.session.userId = rows[0].id;
                    db.checkForUserSignature(rows[0].id).then(({ rows }) => {
                        if (rows.length > 0) {
                            req.session.signatureId = rows[0].id;
                            res.redirect("/thanks");
                        } else {
                            res.redirect("/petition");
                        }
                    });
                } else {
                    res.render("login", {
                        title: "login",
                        userLoggedOut: true,
                        error: true,
                        message: "Incorrect login or password.",
                    });
                }
            });
        })
        .catch((err) => {
            res.render("login", {
                title: "login",
                userLoggedOut: true,
                error: true,
                message: "Incorrect login or password.",
            });
        });
});

// Logout
router.get("/logout", requireLoggedIn, (req, res) => {
    req.session = null;
    res.render("logout", {
        title: "logout",
    });
});

module.exports = router;
