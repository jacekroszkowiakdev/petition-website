const express = require("express");
const router = express.Router();
const {
    requireLoggedIn,
    requireSignedPetition,
} = require("../middleware/routesLogic.middleware");
const {
    getSignature,
    getSignatoriesCount,
    deleteSignatureFromDB,
} = require("../services/services");

// display the thanks page
router.get(
    "/thanks",
    requireLoggedIn,
    requireSignedPetition,
    async (req, res) => {
        try {
            const signature = await getSignature(req.session.signatureId);
            const count = await getSignatoriesCount();
            res.render("thanks", {
                title: "Thank you for signing",
                count,
                signature,
            });
        } catch (err) {
            console.error("Error reading data from DB: ", err);
            res.render("thanks", {
                title: "Thank you for signing",
                count: err.count || 0,
                signature: err.signature || null,
                message:
                    err.message || "Failed to load your signature from the DB",
            });
        }
    }
);

// handle signature removal
router.post(
    "/thanks",
    requireLoggedIn,
    requireSignedPetition,
    async (req, res) => {
        try {
            const count = await getSignatoriesCount();
            await deleteSignatureFromDB(req.session.userId);
            req.session.signatureId = null;
            res.redirect("/petition");
        } catch (err) {
            console.error("Error deleting signature form DB: ", err);
            res.render("thanks", {
                title: "Thank you for signing",
                count: err.count || 0,
                message:
                    err.message ||
                    "Failed to delete your signature from the DB",
            });
        }
    }
);

module.exports = router;
