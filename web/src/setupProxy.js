const proxy = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(proxy('/cable', {target: 'http://localhost:4000', ws: true}));
  app.use(proxy('/api', {target: 'http://localhost:4000'}));
};
