#!/bin/bash
#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: ./deploy.sh <app-name>"
  echo "This will deploy the app to a CF foundation of your choosing"
  exit 1
fi
# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/mixpanel.sh" "CF $(basename "${BASH_SOURCE[0]}")" "$@"

APP_HOST=$1
SESSION_TIME=${SESSION_TIME:-'""'}
ADMIN_EMAIL="${ADMIN_EMAIL:-email@example.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-password}"

ASSETS_DIR="$SCRIPT_DIR/../assets"
CONFIG_DIR="$SCRIPT_DIR/config"

cf target \
  || (echo 'You need to have the CF CLI installed and be logged in' \
    && exit 1)

cp "$CONFIG_DIR/config.js" "$ASSETS_DIR/client/config.js"
cf push -f "$CONFIG_DIR"/manifest.yml -p "$ASSETS_DIR" --var "api-app-name=$APP_HOST" --var "session-time=$SESSION_TIME"


CF_VERSION="$(cf -v | awk '{print $3}' | awk -F '.' '{print $1}')"
TASK_COMMAND="ADMIN_EMAIL=$ADMIN_EMAIL ADMIN_PASSWORD=$ADMIN_PASSWORD rake admin:create_user"

if [ $CF_VERSION -ge 7 ]; then
  cf run-task "$APP_HOST" --command "$TASK_COMMAND"
else
  cf run-task "$APP_HOST" "$TASK_COMMAND"
fi
