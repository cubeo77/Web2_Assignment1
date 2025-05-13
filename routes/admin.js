const express = require("express");
const router = express.Router();
const { database } = require("../database");

const { isAdmin } = require('../middleware/authorization');
const { authenticated } = require('../middleware/authentication');

router.get("/", authenticated, isAdmin, async (req, res) => {
    const users = await database.db("Assignment1").collection("users").find().toArray();
    res.render('admin', { title: req.session.user, users: users });
});

router.post("/promote", async (req, res) => {


    try {
        const { email } = req.body;
        console.log("Session email:", req.session.email);
        console.log("Request body email:", email);

        await database.db("Assignment1").collection("users").updateOne({ email }, { $set: { type: "admin" } });
        if (req.session.email === email) {
            req.session.type = "admin";
            console.log("Current session type:", req.session.type);
        }
    } catch (err) {
        console.error("Promote error:", err);
        res.status(500).send("Failed to promote");
    }
});

router.post("/demote", async (req, res) => {

    try {
        const { email } = req.body;
        await database.db("Assignment1").collection("users").updateOne({ email }, { $set: { type: "user" } });
        if (req.session.email === email) {
            req.session.type = "user";
            console.log("Current session type:", req.session.type);

        }
    } catch (err) {
        console.error("Demote error:", err);
        res.status(500).send("Failed to demote");
    }
});

module.exports = router;
