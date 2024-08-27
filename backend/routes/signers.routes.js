const express = require("express");
const router = express.Router();
const {
    requireLoggedIn,
    requireSignedPetition,
} = require("../middleware/routesLogic.middleware");
const db = require("../db");

//  all signers
router.get("/signers", requireLoggedIn, requireSignedPetition, (req, res) => {
    db.getSignatories()
        .then(({ rows }) => {
            res.render("signers", {
                title: "Petition Signatories",
                rows,
            });
        })
        .catch((err) => {
            console.log("Error reading signatories from DB:", err);
            res.status(500).send("Internal Server Error");
        });
});

// signers by city
router.get(
    "/signers/:city",
    requireLoggedIn,
    requireSignedPetition,
    (req, res) => {
        const city = req.params.city;

        db.getSignatoriesByCity(city)
            .then(({ rows }) => {
                res.render("signers", {
                    title: `${
                        city.charAt(0).toUpperCase() + city.slice(1)
                    } Signatories`,
                    rows,
                });
            })
            .catch((err) => {
                console.log("Error reading signatories by city from DB:", err);
                res.status(500).send("Internal Server Error");
            });
    }
);

module.exports = router;
