const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Log para debug
router.use((req, res, next) => {
    console.log('=== Cidade Route Debug ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('========================');
    next();
});

// Listar todas as cidades
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM cidades ORDER BY nome');
        console.log('Cidades encontradas:', rows.length);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar cidades:', {
            message: error.message,
            stack: error.stack,
            sql: error.sql
        });
        res.status(500).json({ 
            error: 'Erro ao buscar cidades',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Cadastrar nova cidade
router.post('/', async (req, res) => {
    try {
        const { nome } = req.body;
        const [result] = await db.query('INSERT INTO cidades (nome) VALUES (?)', [nome]);
        res.status(201).json({ id: result.insertId, nome });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 