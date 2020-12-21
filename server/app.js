const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const API_SERVICE_URL = 'https://fantasy.premierleague.com/api';
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});*/

app.use(express.static(path.join(__dirname, 'build')));

// Proxy endpoints
app.use('', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));