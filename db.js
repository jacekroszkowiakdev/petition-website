const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petitiondb");
//spicedPg("whoAreWeTalkingTo:whichDBUserWillRunMyCommands:theUserPasswordForOurDbUser@PostgrePort/nameOfDatabase")

// The object that is returned from the cal
// l above has a single method, query, that you can use to query your database.

// db.query('SELECT * FROM actors').then(function(result) {
//     console.log(result.rows);
// }).catch(function(err) {
//     console.log(err);
// });

// module.exports.getCities = () => {
//     const q = `SELECT * FROM cities`;
//     return db.query(q);
// };

// module.exports.addCity = (cityName, countryName) => {
//     const q = `INSERT INTO cities (city,country)
//     VALUES ($1 , $2)`;
//     const params = [cityName, countryName];

//     return db.query(q, params);
// };

// module.exports.getSpicificCity = (cityName) => {
//     const q = `SELECT * FROM cities
//                 WHERE city = $1`;
//     const params = [cityName];
//     return db.query(q, params);
// };

// inserts are composed of INSERT INTO tableName (columnWeWantToAddValueInto, columnWeWantToAddValueInto)

module.exports.addSignature = (firstName, lastName, signature) => {
    const q = `INSERT INTO signatures (first, last, signature)
    VALUES ($1 , $2 , $3 )`;
    const params = [firstName, lastName, signature];
    console.log("record added");
    return db.query(q, params);
};

module.exports.getSignatories = (signatories) => {
    const q = `SELECT * FROM signatures
                WHERE first = $1
                WHERE second = $2`;

    const params = [signatories];
    return db.query(q, params);
};
