const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./db/connection');

const app = express();

// Prefixo global para todas as rotas da API
const API_PREFIX = '/gestao/api';

// Middlewares
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://gestao.brasilemdobro.com.br', 'https://api.brasilemdobro.com.br'] // Domínios corretos
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json());

// Add security headers middleware
app.use((req, res, next) => {
    // Prevent clickjacking
    res.header('X-Frame-Options', 'DENY');
    // Enable XSS filter
    res.header('X-XSS-Protection', '1; mode=block');
    // Prevent MIME type sniffing
    res.header('X-Content-Type-Options', 'nosniff');
    // Strict transport security (uncomment in production)
    // res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Prefixo /gestao/api para todas as rotas da API
app.use(API_PREFIX, (req, res, next) => {
    console.log('=== API Request ===');
    console.log('Hitting API endpoint');
    console.log('Full path:', req.originalUrl);
    console.log('Method:', req.method);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('Params:', req.params);
    console.log('=== End API Request ===');
    
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Adicione este middleware no início, logo após as configurações do CORS
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Path:', req.path);
    console.log('Route Match:', req.route);
    next();
});

// Adicione este middleware logo após a definição do API_PREFIX
app.use((req, res, next) => {
    console.log('=== Request Debug Info ===');
    console.log('Full URL:', req.protocol + '://' + req.get('host') + req.originalUrl);
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Base URL:', req.baseUrl);
    console.log('Original URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('=== End Debug Info ===');
    next();
});

// Middleware para debug de rotas
app.use((req, res, next) => {
    console.log('Request:', {
        method: req.method,
        url: req.url,
        path: req.path,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl
    });
    next();
});

// Rotas da API
app.use(`${API_PREFIX}/cidades`, require('./routes/cidadeRoutes'));
app.use(`${API_PREFIX}/lotes`, require('./routes/loteRoutes'));
app.use(`${API_PREFIX}/lancamentos`, require('./routes/lancamentoRoutes'));
app.use(`${API_PREFIX}/usuarios`, require('./routes/usuarioRoutes'));

// Middleware para debug de rotas
app.use((req, res, next) => {
    console.log('Request:', {
        method: req.method,
        url: req.url,
        path: req.path,
        originalUrl: req.originalUrl
    });
    next();
});

// Depois servimos os arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Middleware para tratar erros 404 da API
app.use(`${API_PREFIX}/*`, (req, res) => {
    console.log('API 404:', req.originalUrl);
    res.status(404).json({ 
        error: 'Rota não encontrada',
        path: req.originalUrl 
    });
});

// Rota para o frontend - DEVE vir depois das rotas da API e arquivos estáticos
app.get('*', (req, res) => {
    console.log('Serving index.html for:', req.url);
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