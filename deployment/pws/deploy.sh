#!/bin/bash

set -e

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cf push -f config/manifest-api.yml -p "$SCRIPT_DIR"/assets/api
cf run-task {{api-app-name}} 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'

cp config/config.js "$SCRIPT_DIR"/assets/web
cf push -f config/manifest-web.yml -p "$SCRIPT_DIR"/assets/web
