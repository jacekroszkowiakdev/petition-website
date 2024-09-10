const express = require("express");
const router = express.Router();
const {
    requireLoggedIn,
    requireUnsignedPetition,
} = require("../middleware/routesLogic.middleware");
const { saveSignature } = require("../services/services.js");

router.get(
    "/petition",
    requireLoggedIn,
    requireUnsignedPetition,
    (req, res) => {
        res.render("petition", {
            title: "Welcome to my petition",
        });
    }
);

router.post(
    "/petition",
    requireLoggedIn,
    requireUnsignedPetition,
    async (req, res) => {
        const { signature } = req.body;

        try {
            const signatureId = await saveSignature(
                signature,
                req.session.userId
            );
            req.session.signatureId = signatureId;
            res.redirect("/thanks");
        } catch (err) {
            console.error("POST /petition error:", err.message);
            res.status(500).send("Internal Server Error");
            res.render("petition", {
                title: "petition",
                error: true,
                message:
                    err.message ||
                    "Error occurred when writing signature to DataBase",
            });
        }
    }
);

module.exports = router;
