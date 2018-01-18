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

const gulp = require('gulp');
const http = require('http');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const {spawn, exec, execSync} = require('child_process');
const path = require('path');
const fs = require('fs');

addApiTasks();
addAssetTasks();
addMockGoogleAuthTasks();

const apiDirectory = process.env.API_DIR || 'api';

function addApiTasks() {

    let api;
    gulp.task('api-server', ['assets-config'], function(cb) {
        api = spawn('bundle', ['exec', 'rails', 'server', '-b', '0.0.0.0', '-p', '4000'],
            {
                cwd: path.join(__dirname, '../../', apiDirectory)
            });

        let stream = getLogStream('api-server');
        api.stdout.on('data', (data) => {
            stream.write(`${data}`);
        });
        api.stderr.on('data', (data) => {
            stream.write(`${data}`);
        });

        waitForServer('localhost', 4000, cb);
    });

    gulp.task('test-api-server', ['assets-config'], function(cb) {
      execSync('bundle exec rake db:create db:migrate db:test:prepare',
        {
          cwd: path.join(__dirname, '../../', apiDirectory)
        });

      execSync('bundle exec rake db:seed',
        {
          cwd: path.join(__dirname, '../../', apiDirectory),
          env: Object.assign(process.env, {
            'RAILS_ENV': 'test'
          })
        });

      api = spawn('bundle', ['exec', 'rails', 'server', '-b', '0.0.0.0', '-p', '4000', '-e', 'test'],
        {
          cwd: path.join(__dirname, '../../', apiDirectory),
          env: Object.assign(process.env, {
            'GOOGLE_AUTH_ENDPOINT': 'http://localhost:3100/auth'
          })
        });

      let stream = getLogStream('api-server');
      api.stdout.on('data', (data) => {
        stream.write(`${data}`);
      });
      api.stderr.on('data', (data) => {
        stream.write(`${data}`);
      });

      waitForServer('localhost', 4000, cb);
    });

    gulp.task('stop-api-server', function() {
      api.kill();
    });
}


function addAssetTasks() {

    let assetServer;
    gulp.task('asset-server', ['assets-config'], function(cb) {
        assetServer = spawn('node', [path.join(__dirname, '../', 'server', 'react-server.js')]);

        let stream = getLogStream('asset-server');
        assetServer.stdout.on('data', (data) => {
            stream.write(`${data}`);
        });
        assetServer.stderr.on('data', (data) => {
            stream.write(`${data}`);
        });

        waitForServer('localhost', 3000, cb);
    });

    gulp.task('stop-asset-server', function() {
        assetServer.kill();
    });

    gulp.task('watch-asset-server', function() {
      gulp.watch(['server/**/*.js', 'helpers/**/*.js', 'lib/**/*.js', 'config/*.json'],
        runSequence('stop-asset-server', 'asset-server'));
    });
}

function addMockGoogleAuthTasks() {

    let googleAuthServer;
    gulp.task('mock-google-auth-server', function(cb) {
        googleAuthServer = spawn('node', [path.join(__dirname, '../', 'server', 'mock-google-auth-server.js')]);

        let stream = getLogStream('mock-google-auth-server');
        googleAuthServer.stdout.on('data', (data) => {
            stream.write(`${data}`);
        });
        googleAuthServer.stderr.on('data', (data) => {
            stream.write(`${data}`);
        });

        waitForServer('localhost', 3100, cb);
    });

    gulp.task('stop-mock-google-auth-server', function() {
        googleAuthServer.kill();
    });
}

function getLogStream(fileName) {
    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
    }
    return fs.createWriteStream(`logs/${fileName}-${Date.now()}.log`);
}


function waitForServer(host, port, cb, count = 0) {
    http.get({host: host, port: port}, () => {
        cb();
    }).on('error', () =>{
        if (count < 20) {
            exec('sleep 2', () => {
                waitForServer(host, port, cb, ++count);
            });
        } else {
            gutil.log(`Timed out waiting for server to start: ${host}:${port}`);
            process.exit(1);
        }
    });
}

