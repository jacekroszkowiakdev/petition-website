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
    console.log("Is match: ", isMatch);
    if (!isMatch) {
        throw new Error("Incorrect password");
    }
    return isMatch;
}

async function checkUserSignature(userId) {
    const { rows } = await db.checkForUserSignature(userId);
    console.log(rows);
    return rows;
}

async function logoutUser(session) {
    return new Promise((resolve, reject) => {
        session.destroy((err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

module.exports = {
    getUserByEmail,
    checkUserPassword,
    checkUserSignature,
    logoutUser,
};
