const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST || 'sql946.main-hosting.eu',
    user: process.env.DB_USER || 'u727308653_admin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'u727308653_controledevend',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('Database configuration:', {
    host: config.host,
    user: config.user,
    database: config.database
});

const pool = mysql.createPool(config);

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
            errno: err.errno,
            host: config.host,
            user: config.user,
            database: config.database
        });
        process.exit(1); // Encerra o processo se não conseguir conectar ao banco
    });

module.exports = pool; 