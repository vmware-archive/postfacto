
cat << EOF > /postfacto/client/config.js
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
    "enable_analytics": $ENABLE_ANALYTICS,
    "contact": "",
    "terms": "",
    "privacy": "",
    "google_oauth_client_id": "$GOOGLE_OAUTH_CLIENT_ID"
  }
};
EOF


bundle exec rails server -b 0.0.0.0 -p 3000