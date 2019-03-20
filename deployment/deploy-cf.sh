#!/usr/bin/env bash

set -euo pipefail

if [[ -z ${1+web-app-name} || -z ${2+api-app-name} ]]; then
    echo "Usage: ./deploy.sh <web-app-name> <api-app-name>"
    exit 1
fi

WEB_HOST=$1
API_HOST=$2
CF_URL=${3:-https://api.run.pivotal.io}
SESSION_TIME=${SESSION_TIME:-'""'}

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR"/assets
CONFIG_DIR="$SCRIPT_DIR"/config

cf login -a $CF_URL --sso

cf push -f "$CONFIG_DIR"/manifest-api.yml -p "$ASSETS_DIR"/api --var api-app-name=$API_HOST --var web-app-name=$WEB_HOST --var pcf-url=$CF_URL --var session-time=$SESSION_TIME
cf run-task $API_HOST 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'

sed -i '' "s/{{api-app-name}}/${API_HOST}/" "$CONFIG_DIR"/config.js
cp "$CONFIG_DIR"/config.js "$ASSETS_DIR"/web
cf push -f "$CONFIG_DIR"/manifest-web.yml -p "$ASSETS_DIR"/web --var api-app-name=$API_HOST --var web-app-name=$WEB_HOST
