const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const sessionMiddleware = require("./middleware/session.middleware");
const {
    csrfMiddleware,
    securityMiddleware,
} = require("./middleware/security.middleware");
const loggingMiddleware = require("./middleware/requestsLogging.middleware");
const {
    setupTemplateEngine,
} = require("./configuration/templateEngine.config");
const app = express();

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const petitionRoutes = require("./routes/petition.routes");
const thanksRoutes = require("./routes/thanks.routes");
const signersRoutes = require("./routes/signers.routes");

// middleware
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use(express.urlencoded({ extended: false }));
app.use(csrfMiddleware);
app.use(securityMiddleware);
app.use(loggingMiddleware);

// template rendering engine
setupTemplateEngine(app);

// routes
//ROOT "/"
app.get("/", (req, res) => {
    res.redirect("/register");
});
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", petitionRoutes);
app.use("/", thanksRoutes);
app.use("/", signersRoutes);

app.listen(process.env.APP_PORT || 8080, () =>
    console.log(`Petition server listening on port ${process.env.APP_PORT}`)
);
