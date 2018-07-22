#!/bin/bash

set -e

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR"/assets
CONFIG_DIR="$SCRIPT_DIR"/config

cf push -f "$CONFIG_DIR"/manifest-api.yml -p "$ASSETS_DIR"/api
cf run-task {{api-app-name}} 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'

cp "$CONFIG_DIR"/config.js "$ASSETS_DIR"/web
cf push -f "$CONFIG_DIR"/manifest-web.yml -p "$ASSETS_DIR"/web
