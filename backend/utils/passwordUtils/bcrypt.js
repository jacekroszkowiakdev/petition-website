const bcrypt = require("bcryptjs");
const { promisify } = require("util");

// Promisify bcrypt methods
const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

const hashPassword = (plainTextPassword) => {
    return genSalt().then((salt) => hash(plainTextPassword, salt));
};

const comparePasswords = (plainTextPassword, hashedPassword) => {
    return compare(plainTextPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePasswords,
};
