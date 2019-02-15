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

set -e

if [ $# -ne 2 ]; then
  echo "usage: ./upgrade_heroku.sh <web-app-name> <api-app-name>"
  echo "This will upgrade an existing Postfacto deployment to a .herokuapp.com host of your choosing"
  exit 1
fi

WEB_HOST=$1
API_HOST=$2

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR"/assets
CONFIG_DIR="$SCRIPT_DIR"/config

if ! heroku apps:info -a "$WEB_HOST" 2>/dev/null; then
  echo "Web host ${WEB_HOST} does not exist! Aborting."
  exit 1
fi

if ! heroku apps:info -a "$API_HOST" 2>/dev/null; then
  echo "API host ${API_HOST} does not exist! Aborting."
  exit 1
fi

###################
# Upgrade the API
###################

pushd "$ASSETS_DIR"/api

rm -rf .git # blow away any existent git directory from a previous run
git init .
git add .
git commit -m "Packaging for Heroku upgrade"
git push --force --set-upstream https://git.heroku.com/${API_HOST}.git master
popd

###########################
# Upgrade the web frontend
###########################

cp "$CONFIG_DIR"/config.js "$ASSETS_DIR"/web/public_html
pushd "$ASSETS_DIR"/web
sed -i '' "s/{{api-app-name}}/${API_HOST}/" public_html/config.js

rm -rf .git # blow away any existent git directory from a previous run
git init .
git add .
git commit -m "Packaging for Heroku upgrade"
git push --force --set-upstream https://git.heroku.com/${WEB_HOST}.git master
popd
