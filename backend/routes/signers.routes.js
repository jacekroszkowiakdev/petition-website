const express = require("express");
const router = express.Router();
const {
    requireLoggedIn,
    requireSignedPetition,
} = require("../middleware/routesLogic.middleware");
const {
    getSignatoriesList,
    getSignatoriesByCity,
    getAllCities,
} = require("../services/services");

//  all signers
router.get(
    "/signers",
    requireLoggedIn,
    requireSignedPetition,
    async (req, res) => {
        try {
            const signatoriesList = await getSignatoriesList();
            const cities = await getAllCities();
            res.render("signers", {
                title: "Petition Signatories",
                signatoriesList,
                cities,
            });
        } catch (err) {
            console.log("Error reading signatories from DB:", err);
            res.render("signers", {
                title: "Petition Signatories",
                message:
                    err.message ||
                    "Failed to load list of signatories from the DB",
            });
        }
    }
);

// signers by city
// router.get(
//     "/signers/:city",
//     requireLoggedIn,
//     requireSignedPetition,
//     (req, res) => {
//         const city = req.params.city;
//         console.log(city);

//         db.getSignatoriesByCity(city)
//             .then(({ rows }) => {
//                 res.render("signers", {
//                     title: `${
//                         city.charAt(0).toUpperCase() + city.slice(1)
//                     } Signatories`,
//                     rows,
//                 });
//             })
//             .catch((err) => {
//                 console.log("Error reading signatories by city from DB:", err);
//                 res.status(500).send("Internal Server Error");
//             });
//     }
// );

// router.get(
//     "/signers/:city",
//     requireLoggedIn,
//     requireSignedPetition,
//     async (req, res) => {
//         try {
//             const city = req.params.city;
//             const cities = await getAllCities();
//             const signatoriesList = await getSignatoriesByCity(city);
//             console.log("byCity: ", signatoriesList);
//             res.render("signers", {
//                 title: `${
//                     city.charAt(0).toUpperCase() + city.slice(1)
//                 } Signatories`,
//                 signatoriesList,
//                 cities,
//             });
//         } catch (err) {
//             res.render("signers", {
//                 title: "Petition Signatories",
//                 message:
//                     err.message ||
//                     "Failed to load list of signatories from the DB",
//                 cities,
//             });
//         }
//     }
// );

router.get(
    "/signers/:city",
    requireLoggedIn,
    requireSignedPetition,
    async (req, res) => {
        try {
            const city = req.params.city;
            console.log("req.params.city", city);
            const cities = await getAllCities();
            console.log("cities", cities);
            const signatoriesList = await getSignatoriesByCity(city);
            console.log("byCity: ", signatoriesList);

            if (signatoriesList.length === 0) {
                console.warn(`No signatories found for city: ${city}`);
            }

            res.render("signers", {
                title: `${
                    city.charAt(0).toUpperCase() + city.slice(1)
                } Signatories`,
                signatoriesList,
                cities,
                city,
            });
        } catch (err) {
            console.error("Error fetching signatories by city:", err);

            res.render("signers", {
                title: "Petition Signatories",
                message:
                    err.message ||
                    "Failed to load list of signatories from the DB",
            });
        }
    }
);

module.exports = router;
