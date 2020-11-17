const express = require('express');
const request = require('request');
const axios = require('axios');
const path = require('path');

const app = express();
const baseUrl = 'https://fantasy.premierleague.com/api';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    const url = baseUrl + req.url;

    request(
        { url: url },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: err.message });
            }

            res.json(JSON.parse(body));
        }
    )
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));