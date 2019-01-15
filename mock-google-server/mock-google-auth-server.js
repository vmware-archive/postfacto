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

/* eslint-disable no-console */

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
