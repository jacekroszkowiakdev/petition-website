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
} = require("../services/services");

// Login
router.get("/login", requireLoggedOut, (req, res) => {
    res.render("login", {
        title: "login",
        userLoggedOut: true,
    });
});

router.post("/login", requireLoggedOut, async (req, res) => {
    const { email, password } = req.body;

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

        if (!isPasswordValid) {
            throw new Error("Incorrect login or password.");
        }

        req.session.userId = getPasswordByEmail.id;
        const signatureResult = await checkUserSignature(getPasswordByEmail.id);

        if (signatureResult) {
            req.session.signatureId = signatureResult[0].id;
            return res.redirect("/thanks");
        }
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
