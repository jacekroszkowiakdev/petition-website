const db = require("./configuration/dataBase.config");

// signatures table:
module.exports.addSignature = (signature, userId) => {
    const q = `INSERT INTO signatures (signature, user_id)
    VALUES ($1, $2) RETURNING id`;
    const params = [signature, userId];
    return db.query(q, params);
};

module.exports.getSignatoriesNumber = () => {
    return db.query("SELECT COUNT (id) FROM  signatures");
};

module.exports.getSignaturePic = (signatureId) => {
    return db.query("SELECT signature FROM signatures WHERE id = $1", [
        signatureId,
    ]);
};

module.exports.deleteSignature = (signatureId) => {
    return db.query("DELETE FROM signatures WHERE id = $1", [signatureId]);
};

// users table:
module.exports.addCredentials = (first, last, email, hashedPassword) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [first, last, email, hashedPassword];
    return db.query(q, params);
};

module.exports.updateCredentials = (
    first,
    last,
    email,
    hashedPassword,
    userId
) => {
    const q = `UPDATE users
    SET first = $1, last = $2, email = $3, password =$4 WHERE id =$5`;
    const params = [first, last, email, hashedPassword, userId];
    return db.query(q, params);
};

module.exports.updateWithOldPassword = (first, last, email, userId) => {
    const q = `UPDATE users
    SET first = $1, last = $2, email = $3 WHERE id = $4`;
    console.log("DB updated, user keeps old password");
    const params = [first, last, email, userId];
    return db.query(q, params);
};

module.exports.getSignatories = () => {
    return db.query(
        "SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url FROM users LEFT JOIN user_profiles ON users.id = user_profiles.user_id INNER JOIN signatures ON users.id = signatures.user_id "
    );
};

module.exports.getCities = () => {
    return db.query(
        `SELECT DISTINCT LOWER(user_profiles.city) AS city
         FROM user_profiles
         INNER JOIN users ON users.id = user_profiles.user_id
         INNER JOIN signatures ON users.id = signatures.user_id
         WHERE user_profiles.city IS NOT NULL
         ORDER BY city ASC`
    );
};

module.exports.getSignatoriesByCity = (city) => {
    return db.query(
        `SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url
         FROM users
         LEFT JOIN user_profiles ON users.id = user_profiles.user_id
         INNER JOIN signatures ON users.id = signatures.user_id
         WHERE LOWER(user_profiles.city) = LOWER($1)`,
        [city]
    );
};

module.exports.checkForUserEmail = (email) => {
    return db.query("SELECT password, id FROM users WHERE email = $1", [email]);
};

module.exports.checkForUserSignature = async (userId) => {
    return db.query("SELECT id FROM signatures WHERE user_id = $1", [userId]);
};

//user_profiles table:
module.exports.addProfileData = (age, city, homepage, userId) => {
    const q = `INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4)`;
    const params = [age || null, city, homepage, userId];
    console.log("Profile added");
    return db.query(q, params);
};

module.exports.upsertProfile = (age, city, homepage, userId) => {
    const q = `INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET age = $1, city = $2, url = $3 RETURNING *`;
    const params = [age || null, city || null, homepage || null, userId];
    console.log("Profile updated");
    return db.query(q, params);
};

//user + user_profile JOIN:
module.exports.getAllUserData = (userId) => {
    return db.query(
        `SELECT users.first, users.last, users.email, user_profiles.age, user_profiles.city, user_profiles.url FROM users LEFT JOIN user_profiles ON users.id = user_profiles.user_id WHERE users.id =($1)`,
        [userId]
    );
};
