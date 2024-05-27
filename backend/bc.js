const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

// use in registration to encrypt password with added random word (salt)
exports.hash = (plainTextPassword) => {
    return genSalt().then((salt) => {
        return hash(plainTextPassword, salt);
    });
};

// use in login to compare user input to the stored hash:
exports.compare = compare;
