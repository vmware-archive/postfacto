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
  echo "This will deploy the app to a .herokuapp.com host of your choosing"
  exit 1
fi

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/mixpanel.sh" "Heroku $(basename "${BASH_SOURCE[0]}")" "$@"

APP_HOST=$1
SESSION_TIME=${SESSION_TIME:-'""'}
HEROKU_REGION=${HEROKU_REGION:-'us'}

ASSETS_DIR="$SCRIPT_DIR/../assets"
CONFIG_DIR="$SCRIPT_DIR/config"

# Prepare assets
cp "$CONFIG_DIR/config.js" "$ASSETS_DIR/client"
cp "$CONFIG_DIR/Procfile" "$ASSETS_DIR"

###################
# Deploy the API
###################

pushd "$ASSETS_DIR"
  heroku create ${APP_HOST} --buildpack https://github.com/heroku/heroku-buildpack-ruby.git#v200 --region ${HEROKU_REGION}
  heroku addons:create heroku-postgresql:hobby-dev -a ${APP_HOST}
  heroku addons:create heroku-redis:hobby-dev -a ${APP_HOST}
  heroku config:set WEBSOCKET_PORT=4443 SESSION_TIME=${SESSION_TIME} -a ${APP_HOST}

  rm -rf .git # blow away any existent git directory from a previous run
  git init .
  git add .
  git commit -m "Packaging for initial Heroku deployment"
  git push --set-upstream https://git.heroku.com/${APP_HOST}.git master
  heroku run rake admin:create_user ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password -a ${APP_HOST} -x
popd
