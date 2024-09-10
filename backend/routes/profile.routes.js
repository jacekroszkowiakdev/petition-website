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
    updateUserData,
    upsertUserProfile,
    updateProfileWithOldPassword,
} = require("../services/services");

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
            title: "Register your profile",
            userLoggedOut: true,
            error: true,
            message: err.message || "Error creating user profile.",
        });
    }
});

// profile
router.get("/profile", requireLoggedIn, requireUnsignedPetition, (req, res) => {
    res.render("profile", {
        title: "Register your profile",
    });
});

router.post(
    "/profile",
    requireLoggedIn,
    requireUnsignedPetition,
    async (req, res) => {
        const { age, city, homepage } = req.body;
        const userId = req.session.userId;

        if (
            homepage.startsWith("http://") ||
            homepage.startsWith("https://") ||
            homepage === ""
        ) {
            try {
                await addUserData(age, city, homepage, userId);
                res.redirect("/petition");
            } catch (err) {
                res.render("profile", {
                    title: "Register your profile",
                    error: true,
                    message: err.message || "Error saving user data.",
                });
            }
        } else {
            res.render("profile", {
                title: "profile",
                error: true,
                message: "Homepage URL must start with http:// or https://.",
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

router.post("/edit", requireLoggedIn, async (req, res) => {
    const { first, last, email, password, age, city, homepage } = req.body;
    const userId = req.session.userId;

    if (
        !homepage.startsWith("http://") &&
        !homepage.startsWith("https://") &&
        homepage !== ""
    ) {
        return res.render("edit", {
            title: "Edit your profile",
            error: true,
            message: "Invalid homepage URL",
        });
    }

    try {
        if (password) {
            await updateUserData(first, last, email, password, userId);
        } else {
            await updateProfileWithOldPassword(first, last, email, userId);
        }

        await upsertUserProfile(age, city, homepage, userId);
        res.redirect("/profile");
    } catch (err) {
        res.render("edit", {
            title: "Edit your profile",
            error: true,
            message:
                err.message ||
                "Something went wrong- please fill the fields again",
        });
    }
});

module.exports = router;
