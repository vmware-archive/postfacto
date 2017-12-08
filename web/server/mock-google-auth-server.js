/* eslint-disable no-console */
require('babel-core/register');
require('babel-polyfill');

const express = require('express');
const app = express();


app.get('/auth', function(req, res) {
   let authHeader = req.header('Authorization');

    if (authHeader.split('_')[0] === 'Bearer expected-valid-access-token') {
        res.type('text/javascript').status(200)
            .send(`{
                "name": "my full name",
                "email": "` + authHeader.split('_')[1] + `@example.com"
            }`);
        return;
    }

    console.log('Request not found');
    res.type('text/javascript').status(404).send('');
});

app.listen(process.env.PORT || 3100);

module.exports = app;
