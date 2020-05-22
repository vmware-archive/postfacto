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

rm -rf package.zip
for DIR in package tmp
do
  if [[ -d $DIR ]]; then
    rm -rf $DIR
  fi
done

# BUILD FRONT-END

if [[ ! $* =~ '--skip-build' ]]; then
  pushd web
    npm run build
    cp ../humans.txt build
  popd
fi

# CREATE APP

mkdir tmp
cp -r api/. tmp
rm -rf tmp/.gitignore
rm -rf tmp/.bundle
rm -rf tmp/client/*
rm -rf tmp/db/*.sqlite3
rm -rf tmp/log/*.log
rm -rf tmp/spec
rm -rf tmp/tmp/*
cp -r web/build/. tmp/client

# BUILD PACKAGES

mkdir -p package/assets
cp -r tmp/. package/assets
rm -rf tmp

# TKG

cp -r deployment/tkg package
cp -r deployment/helm/postfacto-*.tgz package/tkg
cp -r deployment/deploy-tkg.sh package/tkg/deploy.sh
cp -r deployment/upgrade-tkg.sh package/tkg/upgrade.sh
cp -r deployment/mixpanel.sh package/tkg/mixpanel.sh
chmod u+x package/tkg/*.sh

# TAS

cp -r deployment/tas package
cp -r deployment/deploy-tas.sh package/tas/deploy.sh
cp -r deployment/upgrade-tas.sh package/tas/upgrade.sh
cp -r deployment/mixpanel.sh package/tas/mixpanel.sh
chmod u+x package/tas/*.sh

# PWS

cp -r deployment/pws package
cp -r deployment/deploy-cf.sh package/pws/deploy.sh
cp -r deployment/migrate-cf.sh package/pws/migrate.sh
cp -r deployment/upgrade-cf.sh package/pws/upgrade.sh
cp -r deployment/mixpanel.sh package/pws/mixpanel.sh
chmod u+x package/pws/*.sh

# CF

cp -r deployment/cf package
cp -r deployment/deploy-cf.sh package/cf/deploy.sh
cp -r deployment/migrate-cf.sh package/cf/migrate.sh
cp -r deployment/upgrade-cf.sh package/cf/upgrade.sh
cp -r deployment/mixpanel.sh package/cf/mixpanel.sh
chmod u+x package/cf/*.sh

# Heroku

cp -r deployment/heroku package
cp -r deployment/deploy-heroku.sh package/heroku/deploy.sh
cp -r deployment/migrate-heroku.sh package/heroku/migrate.sh
cp -r deployment/upgrade-heroku.sh package/heroku/upgrade.sh
cp -r deployment/mixpanel.sh package/heroku/mixpanel.sh
chmod u+x package/heroku/*.sh

# Docs

cp deployment/README.md package

# Zip

zip -r package.zip package
rm -r package
