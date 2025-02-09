const mysql = require('mysql2/promise');
require('dotenv').config();

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
        console.log('Database connected successfully');
        console.log('Connection ID:', connection.threadId);
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to database:', {
            message: err.message,
            code: err.code,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE
        });
    });

module.exports = pool; 