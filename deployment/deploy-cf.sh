#!/bin/bash

set -e

WEB_HOST=$1
API_HOST=$2
API_ENDPOINT=${3:-https://api.run.pivotal.io}
APP_DOMAIN=${4:-cfapps.io}
SESSION_TIME=${SESSION_TIME:-'""'}

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR"/assets
CONFIG_DIR="$SCRIPT_DIR"/config

cf login -a "${API_ENDPOINT}"

cf push -f "$CONFIG_DIR"/manifest-api.yml -p "$ASSETS_DIR"/api --var api-app-name=$API_HOST --var web-app-name=$WEB_HOST --var pcf-url=${APP_DOMAIN} --var session-time=$SESSION_TIME
cf run-task $API_HOST 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'

sed \
  -e "s/{{api-app-name}}/${API_HOST}/" \
  -e "s/{{pcf-url}}/${APP_DOMAIN}/" \
  <"$CONFIG_DIR"/config.js \
  >"$ASSETS_DIR"/web/config.js

cf push -f "$CONFIG_DIR"/manifest-web.yml -p "$ASSETS_DIR"/web --var api-app-name=$API_HOST --var web-app-name=$WEB_HOST
