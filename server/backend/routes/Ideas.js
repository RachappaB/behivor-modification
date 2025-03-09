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


// Get a single ideas by ID
router.get("/:id", async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM Ideas WHERE id = ?", [req.params.id]);
        if (result.length === 0) return res.status(404).json({ message: "ideas not found" });
        res.json(result[0]);
    } catch (err) {
        console.error("Error fetching ideas:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Add a new ideas
router.post("/", async (req, res) => {
    const { thoughts } = req.body;


    if (!phone_number || !name) {
        return res.status(400).json({ error: "Phone number and name are required" });
    }

    try {
        const sql = `
            INSERT INTO Ideas (thoughts)
            VALUES (?)`;
        const [result] = await db.query(sql, [phone_number, name, village, district, gender, economy, position, work, interest, photo_address]);

        res.status(201).json({ message: "ideas added successfully", id: result.insertId });
    } catch (err) {
        console.error("Error adding ideas:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a ideas's details
router.put("/:id", async (req, res) => {
    const { thoughts } = req.body;

    try {
        const sql = `
            UPDATE Ideas
            SET thoughts =?
            WHERE id=?`;
        const [result] = await db.query(sql, [phone_number, name, village, district, gender, economy, position, work, interest, photo_address, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ideas not found" });
        }

        res.json({ message: "ideas updated successfully" });
    } catch (err) {
        console.error("Error updating ideas:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a ideas
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM Ideas WHERE id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ideas not found" });
        }

        res.json({ message: "ideas deleted successfully" });
    } catch (err) {
        console.error("Error deleting ideas:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
