// These settings are used for local development
// They are overwritten in production

window.Retro = {
  config: {
    "globalNamespace": "Retro",
    "title": "Postfacto",
    "scripts": ["application.js"],
    "stylesheets": ["application.css"],
    "useRevManifest": false, // TODO: dead?
    "hotModule": true,
    "useWebpackDevMiddleware": true,
    "api_base_url": "http://localhost:4000",
    "websocket_url": "ws://localhost:4000/cable",
    "enable_analytics": false,
    "google_oauth_client_id": null,
    "mock_google_auth": true,
    "contact": "mailto:postfacto@example.com",
    "terms": "https://loripsum.net/api",
    "privacy": "https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1&format=html"
  }
};
