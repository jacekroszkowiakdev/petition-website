module.exports.requireLoggedIn = (req, res, next) => {
    if (
        !req.session.userId &&
        req.url != "/" &&
        req.url != "register" &&
        req.url != "/login"
    ) {
        res.redirect("/register");
    } else {
        next();
    }
};

module.exports.requireLoggedOut = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect("/thanks");
    }
    next();
};

module.exports.requireSignedPetition = (req, res, next) => {
    if (!req.session.signatureId) {
        res.redirect("/petition");
    } else {
        next();
    }
};

module.exports.requireUnsignedPetition = (req, res, next) => {
    if (req.session.signatureId) {
        res.redirect("/thanks");
    } else {
        next();
    }
};
