#!/bin/bash

set -e

WEB_HOST=$1
API_HOST=$2
CF_URL=${3:-https://api.run.pivotal.io}

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR"/assets
CONFIG_DIR="$SCRIPT_DIR"/config

cf login -a $CF_URL

cf push -f "$CONFIG_DIR"/manifest-api.yml -p "$ASSETS_DIR"/api --var api-app-name=$API_HOST --var web-app-name=$WEB_HOST --var pcf-url=$CF_URL --var secret-key-base=$(openssl rand -hex 64)
cf run-task $API_HOST 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'

sed -i '' "s/{{api-app-name}}/${API_HOST}/" "$CONFIG_DIR"/config.js
cp "$CONFIG_DIR"/config.js "$ASSETS_DIR"/web
cf push -f "$CONFIG_DIR"/manifest-web.yml -p "$ASSETS_DIR"/web --var api-app-name=$API_HOST --var web-app-name=$WEB_HOST
