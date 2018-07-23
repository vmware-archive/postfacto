#!/bin/bash

set -e

mkdir package

# BUILD FRONT-END

pushd web
  NODE_ENV=production gulp assets
  gulp package
popd

# PWS

cp -r deployment/pws package
cp -r deployment/deploy.sh package/pws/deploy.sh
chmod u+x package/pws/deploy.sh

mkdir package/pws/assets

cp -r api package/pws/assets/api
cp -r web/package package/pws/assets/web

# PCF

cp -r deployment/pcf package
cp -r deployment/deploy.sh package/pcf/deploy.sh
chmod u+x package/pcf/deploy.sh

mkdir package/pcf/assets

cp -r api package/pcf/assets/api
cp -r web/package package/pcf/assets/web

# Docs

cp deployment/INSTRUCTIONS.md package

# Zip

zip -r package.zip package
rm -r package
