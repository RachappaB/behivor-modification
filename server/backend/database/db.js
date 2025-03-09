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


            
            `CREATE TABLE IF NOT EXISTS Healthband (
                id INT AUTO_INCREMENT PRIMARY KEY,
                x VARCHAR(20) NOT NULL,
                y VARCHAR(20) NOT NULL,
                z VARCHAR(20) NOT NULL,
                x_a VARCHAR(20) NOT NULL,
                y_a VARCHAR(20) NOT NULL,
                z_a VARCHAR(20) NOT NULL,
                h1 VARCHAR(20) NOT NULL,
                h2 VARCHAR(20) NOT NULL,
                h3 VARCHAR(20) NOT NULL,
                temp VARCHAR(20) NOT NULL,
                w_day VARCHAR(20) ,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,


            `CREATE TABLE IF NOT EXISTS Fellings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fellings VARCHAR(20) NOT NULL
                
            )`

 
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
