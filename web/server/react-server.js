require('babel-core/register');
require('babel-polyfill');


const express = require('express');
const path = require('path');
const config = require('pui-react-tools/assets/config');

const {useWebpackDevMiddleware} = config;
const app = express();


if (useWebpackDevMiddleware) {

    const webpackHotMiddleware = require('pui-react-tools/middleware/webpack');
    app.use(...webpackHotMiddleware());

    app.get('/config.js', function(req, res) {
        // Override response for config.js
        config.mock_google_auth = process.env.USE_MOCK_GOOGLE;
        res.type('text/javascript').status(200)
            .send(`window.${config.globalNamespace} = {config: ${JSON.stringify(config)}}`);
    });

    // Serve static files from public folder
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // Handle other routes using React router
    app.get('*', webpackHotMiddleware.url('/index.html'));
} else {
    app.use(express.static(path.join(__dirname, '..', 'public')));
}

app.listen(process.env.PORT || 3000);

module.exports = app;
