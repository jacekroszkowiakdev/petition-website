const express = require("express");
const router = express.Router();
const {
    requireLoggedIn,
    requireSignedPetition,
} = require("../middleware/routesLogic.middleware");
const db = require("../db");

// display the thanks page
router.get("/thanks", requireLoggedIn, requireSignedPetition, (req, res) => {
    Promise.all([
        db.getSignaturePic(req.session.signatureId),
        db.getSignatoriesNumber(),
    ])
        .then((result) => {
            const signature = result[0].rows[0].signature;
            const count = result[1].rows[0].count;
            res.render("thanks", {
                title: "Thank you for signing",
                count,
                signature,
            });
        })
        .catch((err) => {
            console.log("error reading data from DB : ", err);
            res.status(500).send("Internal Server Error");
        });
});

// handle signature removal
router.post("/thanks", requireLoggedIn, requireSignedPetition, (req, res) => {
    db.deleteSignature(req.session.userId)
        .then(() => {
            req.session.signatureId = null;
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log(
                "error while attempting to delete signature from DB",
                err
            );
            res.status(500).send("Internal Server Error");
        });
});

module.exports = router;
