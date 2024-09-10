const path = require("path");
const hb = require("express-handlebars");

const viewsDir = path.join(__dirname, "../../frontend/views");

const formatCityName = (city) => {
    if (typeof city !== "string") return city;
    return city.charAt(0).toUpperCase() + city.slice(1);
};

const eq = (a, b) => {
    return a === b;
};

module.exports.setupTemplateEngine = (app) => {
    app.engine(
        "handlebars",
        hb({
            defaultLayout: "main",
            layoutsDir: path.join(viewsDir, "layouts"),
            partialsDir: path.join(viewsDir, "partials"),
            extname: "handlebars",
            helpers: {
                formatCityName: formatCityName,
                eq: eq,
            },
        })
    );
    app.set("view engine", "handlebars");
    app.set("views", viewsDir);
};
