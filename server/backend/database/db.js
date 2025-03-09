require('dotenv').config();
const mysql = require('mysql2/promise'); // Use promise-based MySQL

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to initialize tables
const initializeTables = async () => {
    try {
        const connection = await pool.getConnection();

        console.log('Connected to MySQL. Creating tables...');

        const tableQueries = [
            `CREATE TABLE IF NOT EXISTS Ideas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                thoughts VARCHAR(20) NOT NULL
                
            )`,

            // `CREATE TABLE IF NOT EXISTS Interests (
            //     id INT AUTO_INCREMENT PRIMARY KEY,
            //     person_id INT NOT NULL,
            //     interest VARCHAR(255) NOT NULL,
            //     FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
            // );`,

            // `CREATE TABLE IF NOT EXISTS Chat (
            //     id INT AUTO_INCREMENT PRIMARY KEY,
            //     person_id INT NOT NULL,
            //     conversation_text TEXT NOT NULL,
            //     date DATETIME DEFAULT CURRENT_TIMESTAMP,
            //     FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
            // );`,

            // `CREATE TABLE IF NOT EXISTS Meetings (
            //     id INT AUTO_INCREMENT PRIMARY KEY,
            //     person_id INT NOT NULL,
            //     meeting_date DATETIME NOT NULL,
            //     topics_discussed TEXT NOT NULL,
            //     FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
            // );`,

            // `CREATE TABLE IF NOT EXISTS Photos (
            //     id INT AUTO_INCREMENT PRIMARY KEY,
            //     person_id INT NOT NULL,
            //     photo_url VARCHAR(500) NOT NULL,
            //     FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
            // );`
        ];

        for (const [index, query] of tableQueries.entries()) {
            await connection.query(query);
            console.log(`Table ${index + 1} created successfully!`);
        }

        connection.release();
    } catch (err) {
        console.error("Database initialization error:", err.message);
    }
};

// Call the function to initialize tables
initializeTables();

module.exports = pool;
