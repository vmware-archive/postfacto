/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
