const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get all Ideas


router.get("/", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM Ideas"); // ✅ Correct way to destructure query result
        res.json(results);
    } catch (err) {
        console.error("Error fetching Ideas:", err);
        res.status(500).json({ error: "Database error" });
    }
});


// Get a single Ideas by ID
router.get("/:id", async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM Ideas WHERE id = ?", [req.params.id]);
        if (result.length === 0) return res.status(404).json({ message: "Ideas not found" });
        res.json(result[0]);
    } catch (err) {
        console.error("Error fetching Ideas:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Add a new Ideas
router.post("/", async (req, res) => {
    const { Ideas } = req.body;


    

    try {
        const sql = `
            INSERT INTO Ideas (Ideas)
            VALUES (?)`;
        const [result] = await db.query(sql, [Ideas]);

        res.status(201).json({ message: "Ideas added successfully", id: result.insertId });
    } catch (err) {
        console.error("Error adding Ideas:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a Ideas's details
router.put("/:id", async (req, res) => {
    const { Ideas } = req.body;

    try {
        const sql = `
            UPDATE Ideas
            SET Ideas =?
            WHERE id=?`;
        const [result] = await db.query(sql, [ Ideas,  req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ideas not found" });
        }

        res.json({ message: "Ideas updated successfully" });
    } catch (err) {
        console.error("Error updating Ideas:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a Ideas
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM Ideas WHERE id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ideas not found" });
        }

        res.json({ message: "Ideas deleted successfully" });
    } catch (err) {
        console.error("Error deleting Ideas:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
