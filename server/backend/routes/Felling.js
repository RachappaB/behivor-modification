const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get all Fellings


router.get("/", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM Fellings"); // ✅ Correct way to destructure query result
        res.json(results);
    } catch (err) {
        console.error("Error fetching Fellings:", err);
        res.status(500).json({ error: "Database error" });
    }
});


// Get a single Fellings by ID
router.get("/:id", async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM Fellings WHERE id = ?", [req.params.id]);
        if (result.length === 0) return res.status(404).json({ message: "Fellings not found" });
        res.json(result[0]);
    } catch (err) {
        console.error("Error fetching Fellings:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Add a new Fellings
router.post("/", async (req, res) => {
    const { fellings } = req.body;


    

    try {
        const sql = `
            INSERT INTO Fellings (fellings)
            VALUES (?)`;
        const [result] = await db.query(sql, [fellings]);

        res.status(201).json({ message: "Fellings added successfully", id: result.insertId });
    } catch (err) {
        console.error("Error adding Fellings:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a Fellings's details
router.put("/:id", async (req, res) => {
    const { fellings } = req.body;

    try {
        const sql = `
            UPDATE Fellings
            SET fellings =?
            WHERE id=?`;
        const [result] = await db.query(sql, [ fellings,  req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Fellings not found" });
        }

        res.json({ message: "Fellings updated successfully" });
    } catch (err) {
        console.error("Error updating Fellings:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a Fellings
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM Fellings WHERE id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Fellings not found" });
        }

        res.json({ message: "Fellings deleted successfully" });
    } catch (err) {
        console.error("Error deleting Fellings:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
