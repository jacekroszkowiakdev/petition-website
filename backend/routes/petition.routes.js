const express = require("express");
const router = express.Router();
const {
    requireLoggedIn,
    requireUnsignedPetition,
} = require("../middleware/routesLogic.middleware");
const db = require("../db");

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
    (req, res) => {
        const { signature } = req.body;
        db.addSignature(signature, req.session.userId)
            .then(({ rows }) => {
                req.session.signatureId = rows[0].id;
                res.redirect("/thanks");
            })
            .catch((err) => {
                console.log("POST/petition error writing to DataBase: ", err);
            });
    }
);

module.exports = router;
