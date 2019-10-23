// These settings are used for local development
// They are overwritten in production

window.Retro = {
  config: {
    "globalNamespace": "Retro",
    "title": "Postfacto",
    "scripts": ["application.js"],
    "stylesheets": ["application.css"],
    "useRevManifest": false,
    "hotModule": true,
    "useWebpackDevMiddleware": true,
    "api_base_url": "/api",
    "websocket_url": "/cable",
    "enable_analytics": false,
    "contact": "mailto:postfacto@example.com",
    "terms": "https://loripsum.net/api",
    "privacy": "https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1&format=html"
  }
};
