#!/bin/bash

set -e

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/mixpanel.sh" "CF $(basename "${BASH_SOURCE[0]}")" "$@"

WEB_HOST=$1
API_HOST=$2
APP_DOMAIN=${3:-cfapps.io}
SESSION_TIME=${SESSION_TIME:-'""'}

ASSETS_DIR="$SCRIPT_DIR"/assets
CONFIG_DIR="$SCRIPT_DIR"/config

cf target \
  || (echo 'You need to have the CF CLI installed and be logged in' \
    && exit 1)

cf push -f "$CONFIG_DIR"/manifest-api.yml -p "$ASSETS_DIR"/api --var api-app-name=$API_HOST --var web-app-name=$WEB_HOST --var pcf-url=${APP_DOMAIN} --var session-time=$SESSION_TIME

sed \
  -e "s/{{api-app-name}}/${API_HOST}/" \
  -e "s/{{pcf-url}}/${APP_DOMAIN}/" \
  <"$CONFIG_DIR"/config.js \
  >"$ASSETS_DIR"/web/config.js

cf push -f "$CONFIG_DIR"/manifest-web.yml -p "$ASSETS_DIR"/web --var api-app-name=$API_HOST --var web-app-name=$WEB_HOST
