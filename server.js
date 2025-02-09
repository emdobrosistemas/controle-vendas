const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./db/connection');

const app = express();
const API_PREFIX = '/gestao/api';

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log('\n=== Nova Requisição ===');
    console.log('URL:', req.originalUrl);
    console.log('Método:', req.method);
    next();
});

// Rotas da API
app.use(`${API_PREFIX}/cidades`, require('./routes/cidadeRoutes'));
app.use(`${API_PREFIX}/lotes`, require('./routes/loteRoutes'));
app.use(`${API_PREFIX}/lancamentos`, require('./routes/lancamentoRoutes'));
app.use(`${API_PREFIX}/usuarios`, require('./routes/usuarioRoutes'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Handler para erros 404 da API
app.use(`${API_PREFIX}/*`, (req, res) => {
    console.log('404 na API:', req.originalUrl);
    res.status(404).json({
        error: 'Endpoint não encontrado',
        url: req.originalUrl
    });
});

// Rota para o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('API Prefix:', API_PREFIX);
    console.log('Rotas registradas:', app._router.stack
        .filter(r => r.route)
        .map(r => `${r.route.path} [${Object.keys(r.route.methods)}]`));
});