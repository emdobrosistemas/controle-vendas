const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de conexão inicial
pool.getConnection()
    .then(connection => {
        console.log('Database connection successful');
        console.log('Connected as ID:', connection.threadId);
        connection.release();
    })
    .catch(error => {
        console.error('Error connecting to database:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
    });

module.exports = pool; 