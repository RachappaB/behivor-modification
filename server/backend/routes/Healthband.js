const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get all Healthband records
router.get("/", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM Healthband");
        res.json(results);
    } catch (err) {
        console.error("Error fetching Healthband:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Get a single Healthband record by ID
router.get("/:id", async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM Healthband WHERE id = ?", [req.params.id]);
        if (result.length === 0) return res.status(404).json({ message: "Healthband not found" });
        res.json(result[0]);
    } catch (err) {
        console.error("Error fetching Healthband:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Add a new Healthband record



router.post("/", async (req, res) => {
    const { x, y, z, x_a, y_a, z_a, h1, h2, h3, temp, w_day } = req.body;

    if (!x || !y || !z || !x_a || !y_a || !z_a || !h1 || !h2 || !h3 || !temp || !w_day) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const sql = `
            INSERT INTO Healthband (x, y, z, x_a, y_a, z_a, h1, h2, h3, temp, w_day)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(sql, [x, y, z, x_a, y_a, z_a, h1, h2, h3, temp, w_day]);

        res.status(201).json({ message: "Healthband added successfully", id: result.insertId });
    } catch (err) {
        console.error("Error adding Healthband:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a Healthband record
router.put("/:id", async (req, res) => {
    const { x, y, z, x_a, y_a, z_a, h1, h2, h3, temp, w_day } = req.body;
    try {
        const sql = `
            UPDATE Healthband
            SET x=?, y=?, z=?, x_a=?, y_a=?, z_a=?, h1=?, h2=?, h3=?, temp=?, w_day=?
            WHERE id=?`;
        const [result] = await db.query(sql, [x, y, z, x_a, y_a, z_a, h1, h2, h3, temp, w_day, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Healthband not found" });
        }

        res.json({ message: "Healthband updated successfully" });
    } catch (err) {
        console.error("Error updating Healthband:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a Healthband record
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM Healthband WHERE id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Healthband not found" });
        }

        res.json({ message: "Healthband deleted successfully" });
    } catch (err) {
        console.error("Error deleting Healthband:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
