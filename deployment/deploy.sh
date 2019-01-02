#!/bin/bash

set -e

WEB_HOST=$1
API_HOST=$2

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR"/assets
CONFIG_DIR="$SCRIPT_DIR"/config

cf login

cf push -f "$CONFIG_DIR"/manifest-api.yml -p "$ASSETS_DIR"/api -v api-app-name=$API_HOST -v web-app-name=$WEB_HOST
cf run-task $API_HOST 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'

cp "$CONFIG_DIR"/config.js "$ASSETS_DIR"/web
sed -i '' "s/{{api-app-name}}/${API_HOST}/" "$ASSETS_DIR"/web/config.js
cf push -f "$CONFIG_DIR"/manifest-web.yml -p "$ASSETS_DIR"/web -v api-app-name=$API_HOST -v web-app-name=$WEB_HOST
