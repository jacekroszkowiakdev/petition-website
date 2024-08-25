const csurf = require("csurf");
const frameguard = require("frameguard");

const csrfMiddleware = csurf();

const securityMiddleware = (req, res, next) => {
    res.set("x-frame-options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    frameguard({ action: "SAMEORIGIN" })(req, res, next); // Apply frameguard as middleware
};

module.exports = { csrfMiddleware, securityMiddleware };
