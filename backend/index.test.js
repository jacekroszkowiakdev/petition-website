const { TestScheduler } = require("jest");
const supertest = require("supertest");
const { app } = require("./index.js");

test("GET /welcome sends a 200 statuscode as a response", () => {
    return supertest(app)
        .get("/register")
        .then((response) => {
            expect(response.statusCode).toBe(404);
        });
});

test("POST /register");
