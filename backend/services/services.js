const {
    comparePasswords,
    hashPassword,
} = require("../utils/passwordUtils/bcrypt");
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
    if (rows.length === 0) {
        throw new Error("User signature not found");
    }
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
    if (!signature || signature.rows.length === 0) {
        throw new Error("Failed to fetch signature from the DB.");
    }
    return signature.rows[0].signature;
}

async function getSignatoriesCount() {
    const signatoriesCount = await db.getSignatoriesNumber();
    if (!signatoriesCount || signatoriesCount.rows.length === 0) {
        throw new Error("Failed to retrieve signatories count.");
    }
    return signatoriesCount.rows[0].count;
}

async function deleteSignatureFromDB(userID) {
    const result = await db.deleteSignature(userID);
    if (!result || result.rowCount === 0) {
        throw new Error("Failed to delete signature.");
    }
}

async function getSignatoriesList() {
    const signatoriesList = await db.getSignatories();
    if (!signatoriesList || signatoriesList.rows.length === 0) {
        throw new Error("No signatories found.");
    }
    return signatoriesList.rows;
}

async function getAllCities() {
    const allCities = await db.getCities();
    if (!allCities || allCities.rows.length === 0) {
        throw new Error("No cities found.");
    }
    return allCities.rows;
}

async function getSignatoriesByCity(city) {
    const signatoriesListByCity = await db.getSignatoriesByCity(city);
    if (!signatoriesListByCity || signatoriesListByCity.rows.length === 0) {
        throw new Error(`No signatories found for city: ${city}`);
    }
    return signatoriesListByCity.rows;
}

async function registerUser(first, last, email, password, userId) {
    const hashedPassword = await hashPassword(password);
    const userCredentials = await db.addCredentials(
        first,
        last,
        email,
        hashedPassword,
        userId
    );

    if (!userCredentials || userCredentials.length === 0) {
        throw new Error("Failed to create user profile.");
    }
    return userCredentials.rows[0];
}

async function addUserData(age, city, homepage, userId) {
    const userData = await db.addProfileData(
        age,
        city.toLowerCase(),
        homepage.toLowerCase(),
        userId
    );
    if (!userData || userData.length === 0) {
        throw new Error("Failed to create user profile.");
    }
    return userData.rows[0];
}

async function getUserData(userId) {
    const userData = await db.getAllUserData(userId);
    if (!userData || userData.length === 0) {
        throw new Error("Failed to create user profile.");
    }
    return userData.rows[0];
}

async function updateUserData(first, last, email, password, userId) {
    const hashedPassword = await hashPassword(password);
    const updatedUserData = await db.updateCredentials(
        first,
        last,
        email,
        hashedPassword,
        userId
    );
    if (!updatedUserData || updatedUserData.length === 0) {
        throw new Error("Failed to update user profile.");
    }
}

async function updateProfileWithOldPassword(first, last, email, userId) {
    const oldPasswordUpdate = await db.updateWithOldPassword(
        first,
        last,
        email,
        userId
    );
    if (!oldPasswordUpdate || oldPasswordUpdate.length === 0) {
        throw new Error("Failed to create user profile.");
    }
}

async function upsertUserProfile(age, city, homepage, userId) {
    const upsertData = await db.upsertProfile(
        age,
        city.toLowerCase(),
        homepage.toLowerCase(),
        userId
    );

    if (!upsertData || upsertData.length === 0) {
        throw new Error("Failed to update user data.");
    }
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
    registerUser,
    addUserData,
    getUserData,
    updateUserData,
    upsertUserProfile,
    updateProfileWithOldPassword,
};
