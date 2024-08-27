// 404 Handling
app.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error", {
        title: "Server Error",
        message: err.message,
    });
});
