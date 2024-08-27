const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const cookieSession = require("cookie-session");

module.exports = cookieSession({
    secret: process.env.COOKIE_SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
