const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petitiondb");
//spicedPg("whoAreWeTalkingTo:whichDBUserWillRunMyCommands:theUserPasswordForOurDbUser@PostgrePort/nameOfDatabase")

// The object that is returned from the call above has a single method, query, that you can use to query your database.
// inserts are composed of INSERT INTO tableName (columnWeWantToAddValueInto, columnWeWantToAddValueInto)

module.exports.addSignature = (firstName, lastName, signature) => {
    const q = `INSERT INTO signatures (first, last, signature)
    VALUES ($1 , $2 , $3 )`;
    const params = [firstName, lastName, signature];
    console.log("input is: ", params);
    console.log("record added");
    return db.query(q, params);
};

module.exports.getSignatories = () => {
    return db.query("SELECT first, last FROM signatures");
};

module.exports.getSignatoriesNumber = () => {
    return db.query("SELECT COUNT (*) FROM  signatures");
};
