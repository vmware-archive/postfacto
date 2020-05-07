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

if [ $# -lt 2 ]; then
  echo "usage: ./migrate.sh <web-app-name> <api-app-name>"
  echo "This will migrate the app on a CF foundation of your choosing"
  exit 1
fi

WEB_HOST=$1
API_HOST=$2
SESSION_TIME=${SESSION_TIME:-'""'}

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/mixpanel.sh" "CF $(basename "${BASH_SOURCE[0]}")" "$@"

cf unset-env $WEB_HOST 'FORCE_HTTPS'

ENABLE_ANALYTICS=false "$SCRIPT_DIR/upgrade.sh" $WEB_HOST

cf delete $API_HOST -f -r
