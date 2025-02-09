const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./db/connection');

const app = express();

// Prefixo global para todas as rotas da API
const API_PREFIX = '/gestao/api';

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Middleware para debug
app.use((req, res, next) => {
    console.log('=== Request Debug ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Original URL:', req.originalUrl);
    next();
});

// IMPORTANTE: Rotas da API ANTES dos arquivos estáticos
app.use(`${API_PREFIX}/cidades`, require('./routes/cidadeRoutes'));
app.use(`${API_PREFIX}/lotes`, require('./routes/loteRoutes'));
app.use(`${API_PREFIX}/lancamentos`, require('./routes/lancamentoRoutes'));
app.use(`${API_PREFIX}/usuarios`, require('./routes/usuarioRoutes'));

// Arquivos estáticos DEPOIS das rotas da API
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Middleware para erros da API
app.use(`${API_PREFIX}/*`, (req, res) => {
    res.status(404).json({
        error: 'API endpoint não encontrado',
        path: req.originalUrl
    });
});

// Rota para o frontend - deve ser a última
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de erro global - DEVE ser o último middleware
app.use((err, req, res, next) => {
    console.error('Erro global:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query
    });

    res.status(err.status || 500).json({
        error: 'Erro na requisição',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor',
        path: req.path
    });
});

// Teste de conexão com o banco
db.query('SELECT 1')
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

// No início da aplicação
console.log('Application starting...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Database config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    port: process.env.PORT
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Variáveis de ambiente carregadas:', {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_DATABASE: process.env.DB_DATABASE,
        PORT: process.env.PORT
    });
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${PORT} em uso, tentando porta ${PORT + 1}`);
        server.close();
        app.listen(PORT + 1);
    } else {
        console.error('Erro ao iniciar servidor:', err);
    }
});