require('babel-core/register');
require('babel-polyfill');

const gulp = require('gulp');
const shell = require('gulp-shell');
const requireDir = require('require-dir');
const runSequence = require('run-sequence');
const {spawn, exec, execSync} = require('child_process');

requireDir('./tasks');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

gulp.task('acceptance', shell.task(['cd ../e2e && bundle exec rspec']));

gulp.task('default', cb => runSequence('lint', 'spec-app', 'acceptance', cb));

gulp.task('server', cb => runSequence('asset-server', 'watch-asset-server', cb));

gulp.task('local-acceptance', cb => {
    process.env.USE_MOCK_GOOGLE = true;
    runSequence('test-api-server', 'asset-server', 'mock-google-auth-server',
        'acceptance',
        'stop-asset-server', 'stop-api-server', 'stop-mock-google-auth-server', cb);
});

gulp.task('local-run', cb => {
  runSequence('api-server', 'asset-server',
    cb);
});

gulp.task('local-run-test', cb => {
  process.env.USE_MOCK_GOOGLE = true;
  runSequence('api-server', 'asset-server',
    'mock-google-auth-server',
    cb);
});

gulp.task('package', cb => {
  execSync('mkdir -p package');
  execSync('cp public/index.html package');
  execSync('cp public/application.js package');
  execSync('cp public/application.css package');
  execSync('cp -rf public/images package/images');
});

