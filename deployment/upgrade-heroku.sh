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
  echo "usage: ./upgrade_heroku.sh <app-name>"
  echo "This will upgrade an existing Postfacto deployment on a .herokuapp.com host of your choosing"
  exit 1
fi

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/mixpanel.sh" "Heroku $(basename "${BASH_SOURCE[0]}")" "$@"

APP_HOST=$1

ASSETS_DIR="$SCRIPT_DIR/../assets"
CONFIG_DIR="$SCRIPT_DIR/config"

if ! heroku apps:info -a "$APP_HOST" 2>/dev/null; then
  echo "App host ${APP_HOST} does not exist! Aborting."
  exit 1
fi


###################
# Upgrade the app
###################
cp "$CONFIG_DIR/config.js" "$ASSETS_DIR/client"
cp "$CONFIG_DIR/Procfile" "$ASSETS_DIR"

pushd "$ASSETS_DIR"
  BUILDPACK='https://github.com/heroku/heroku-buildpack-ruby.git#v200'
  if [[ ! $(heroku buildpacks -a ${APP_HOST}) =~ ${BUILDPACK} ]]; then
    heroku buildpacks:set -a ${APP_HOST} ${BUILDPACK}
  fi
  rm -rf .git # blow away any existent git directory from a previous run
  git init .
  git add .
  git commit -m "Packaging for Heroku upgrade"
  git push --force --set-upstream https://git.heroku.com/${APP_HOST}.git master
popd
