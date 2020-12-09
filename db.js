const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petitiondb");
//spicedPg("whoAreWeTalkingTo:whichDBUserWillRunMyCommands:theUserPasswordForOurDbUser@PostgrePort/nameOfDatabase")

// The object that is returned from the call above has a single method, query, that you can use to query your database.
// inserts are composed of INSERT INTO tableName (columnWeWantToAddValueInto, columnWeWantToAddValueInto)

// signatures table:
module.exports.addSignature = (signature, userId) => {
    const q = `INSERT INTO signatures (signature, user_id)
    VALUES ($1, $2) RETURNING id`;
    const params = [signature, userId];
    console.log("input is: ", params);
    console.log("record added");
    return db.query(q, params);
};

module.exports.getSignatories = () => {
    return db.query("SELECT first, last FROM users");
};

module.exports.getSignatoriesNumber = () => {
    return db.query("SELECT COUNT (*) FROM  signatures");
};

module.exports.getSignaturePic = (signatureId) => {
    return db.query("SELECT signature FROM signatures WHERE id = ($1)", [
        signatureId,
    ]);
};

// users table:
module.exports.addCredentials = (first, last, email, hashedPassword) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [first, last, email, hashedPassword];
    return db.query(q, params);
};

module.exports.checkForUserEmail = (email) => {
    return db.query("SELECT password FROM users WHERE id = ($1)", [email]);
};

module.exports.checkForUserSignature = (userId) => {
    return db.query("SELECT signature FROM signatures WHERE user_id = ($1)", [
        userId,
    ]);
};
