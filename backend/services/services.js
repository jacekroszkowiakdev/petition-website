// Services contain the business logic and interact with data.
const { comparePasswords } = require("../utils/passwordUtils/bcrypt");
const db = require("../db");

async function getUserByEmail(email) {
    const { rows } = await db.checkForUserEmail(email);
    if (rows.length === 0) {
        throw new Error("User not found");
    }
    return rows[0];
}

async function checkUserPassword(user, password) {
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
        throw new Error("Incorrect password");
    }
    return isMatch;
}

async function checkUserSignature(userId) {
    const { rows } = await db.checkForUserSignature(userId);
    return rows;
}

async function saveSignature(signature, userId) {
    const { rows } = await db.addSignature(signature, userId);
    if (!rows || rows.length === 0) {
        throw new Error("Failed to add signature.");
    }
    return rows[0].id;
}

async function getSignature(signatureId) {
    const signature = await db.getSignaturePic(signatureId);
    if (!signature || signature.length === 0) {
        throw new Error("Failed to fetch signature from the DB.");
    }
    return signature.rows[0].signature;
}

async function getSignatoriesCount() {
    const signatoriesCount = await db.getSignatoriesNumber();
    return signatoriesCount.rows[0].count;
}

async function deleteSignatureFromDB(userID) {
    await db.deleteSignature(userID);
}

async function getSignatoriesList() {
    const signatoriesList = await db.getSignatories();
    return signatoriesList.rows;
}

async function getAllCities() {
    const allCities = await db.getCities();
    return allCities.rows;
}

async function getSignatoriesByCity(city) {
    console.log("Fetching signatories for city:", city);
    const signatoriesListByCity = await db.getSignatoriesByCity(city);
    console.log("Results:", signatoriesListByCity.rows);
    return signatoriesListByCity.rows;
}

module.exports = {
    getUserByEmail,
    checkUserPassword,
    checkUserSignature,
    saveSignature,
    getSignature,
    getSignatoriesCount,
    getAllCities,
    getSignatoriesList,
    getSignatoriesByCity,
    deleteSignatureFromDB,
};
