const path = require("path");
const hb = require("express-handlebars");

const viewsDir = path.join(__dirname, "../../frontend/views");

module.exports.setupTemplateEngine = (app) => {
    app.engine(
        "handlebars",
        hb({
            defaultLayout: "main",
            layoutsDir: path.join(viewsDir, "layouts"),
            partialsDir: path.join(viewsDir, "partials"),
            extname: "handlebars",
        })
    );
    app.set("view engine", "handlebars");
    app.set("views", viewsDir);
};
