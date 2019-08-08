#! /bin/bash
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

curl -L -o last-release.zip 'https://github.com/pivotal/postfacto/releases/latest/download/package.zip'
unzip package.zip
unzip last-release.zip -d last-release
echo 'Setup complete'

HEROKU_OLD_WEB='postfacto-travis-old-web'
HEROKU_OLD_API='postfacto-travis-old-api'
HEROKU_NEW_WEB='postfacto-travis-new-web'
HEROKU_NEW_API='postfacto-travis-new-api'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

pushd "$SCRIPT_DIR/last-release/package/heroku"
  echo 'Deploying old version to Heroku'
  ./deploy.sh $HEROKU_OLD_WEB $HEROKU_OLD_API
popd

pushd "$SCRIPT_DIR/package/heroku"
  echo 'Upgrading old version on Heroku'
  ./upgrade.sh $HEROKU_OLD_WEB $HEROKU_OLD_API

  echo 'Deploying new version to Heroku'
  ./deploy.sh $HEROKU_NEW_WEB $HEROKU_NEW_API
popd

echo 'Cleaning up Heroku'
for APP in $HEROKU_OLD_WEB $HEROKU_OLD_API $HEROKU_NEW_WEB $HEROKU_NEW_API
do
  heroku apps:delete -a $APP -c $APP
done

echo 'Cleaning up working directory'
rm -rf ./last-release ./last-release.zip ./package
