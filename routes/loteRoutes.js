const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Log para debug
router.use((req, res, next) => {
    console.log('Lote Route accessed:', req.method, req.url);
    next();
});

// Listar todos os lotes
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM lotes ORDER BY id');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar lotes:', error);
        res.status(500).json({ error: 'Erro ao buscar lotes' });
    }
});

// Cadastrar novo lote
router.post('/', async (req, res) => {
    try {
        const { nome, cidade_id } = req.body;
        const [result] = await db.query(
            'INSERT INTO lotes (nome, cidade_id) VALUES (?, ?)', 
            [nome, cidade_id]
        );
        res.status(201).json({ id: result.insertId, nome, cidade_id });
    } catch (error) {
        console.error('Erro ao criar lote:', error);
        res.status(500).json({ error: 'Erro ao criar lote' });
    }
});

module.exports = router; 