const express = require("express");
const router = express.Router();
const {
    requireLoggedOut,
    requireLoggedIn,
} = require("../middleware/routesLogic.middleware");
const { comparePasswords } = require("../utils/passwordUtils/bcrypt");
const {
    getUserByEmail,
    checkUserPassword,
    checkUserSignature,
    logoutUser,
} = require("../services/services");
const db = require("../db");

// Login
router.get("/login", requireLoggedOut, (req, res) => {
    res.render("login", {
        title: "login",
        userLoggedOut: true,
    });
});

router.get("/logins", requireLoggedOut, (req, res) => {
    res.render("login", {
        title: "ZZZ",
        userLoggedOut: true,
        message: "LOGINS",
    });
});

router.post("/login", requireLoggedOut, (req, res) => {
    const { email, password } = req.body;

    db.checkForUserEmail(email)
        .then(({ rows }) => {
            comparePasswords(password, rows[0].password).then((result) => {
                if (result) {
                    req.session.userId = rows[0].id;
                    console.log("User ID:", req.session.userId);
                    db.checkForUserSignature(rows[0].id).then(({ rows }) => {
                        if (rows.length > 0) {
                            req.session.signatureId = rows[0].id;
                            console.log(
                                "req.session.signatureId LOGIN POST",
                                req.session.signatureId
                            );
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
                message: err.message || "Incorrect login or password.",
            });
        });
});

router.post("/logins", requireLoggedOut, async (req, res) => {
    const { email, password } = req.body;
    console.log("logins body:", email, password);

    try {
        const getPasswordByEmail = await getUserByEmail(email);
        console.log("user", getPasswordByEmail);

        if (getPasswordByEmail.length === 0) {
            throw new Error("No user found with that email.");
        }

        const isPasswordValid = await checkUserPassword(
            getPasswordByEmail,
            password
        );
        console.log("valid", isPasswordValid);
        if (!isPasswordValid) {
            throw new Error("Incorrect login or password.");
        }

        // Store user ID in session
        req.session.userId = getPasswordByEmail.id;
        console.log("User ID set in session:", req.session.userId);

        // Check if the user has a signature
        const signatureResult = await checkUserSignature(getPasswordByEmail.id);
        console.log("Signature result:", signatureResult);

        // Handle the case where no signature is found
        if (signatureResult) {
            req.session.signatureId = signatureResult;
            console.log(
                "Signature ID set in session:",
                req.session.signatureId
            );
            return res.redirect("/thanks");
        }

        // Redirect to petition if no signature found
        return res.redirect("/petition");
    } catch (err) {
        console.error("Error in login process:", err);
        res.render("login", {
            title: "login",
            userLoggedOut: true,
            error: true,
            message: err.message || "An error occurred during login.",
        });
    }
});

// Logout
router.get("/logout", requireLoggedIn, (req, res) => {
    req.session = null;
    res.render("logout", {
        title: "logout",
    });
});

module.exports = router;
