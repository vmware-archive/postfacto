#!/usr/bin/env bash
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

if [ $# -lt 2 ]; then
  echo "usage: ./upgrade.sh <web-app-name> <api-app-name> [<pcf-url>]"
  exit 1
fi

WEB_HOST=$1
API_HOST=$2
APP_DOMAIN=${3:-cfapps.io}
SESSION_TIME=${SESSION_TIME:-'""'}

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR"/assets
CONFIG_DIR="$SCRIPT_DIR"/config

sed \
  -e "s/{{web-app-name}}/${WEB_HOST}/" \
  -e "s/{{pcf-url}}/${APP_DOMAIN}/" \
  <"$CONFIG_DIR"/config.js \
  >"$ASSETS_DIR"/web/config.js

cf push \
  -f "$CONFIG_DIR"/manifest.yml \
  --var api-app-name=$API_HOST \
  --var web-app-name=$WEB_HOST \
  --var pcf-url=${APP_DOMAIN} \
  --var session-time=$SESSION_TIME

cf delete-route ${APP_DOMAIN} --hostname ${API_HOST} -f
