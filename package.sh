#!/bin/bash

set -e

mkdir package

# PWS

cp -r deployment/pws package
mkdir package/pws/assets

cp -r api package/pws/assets/api

pushd web
  NODE_ENV=production gulp assets
  gulp package
popd
cp -r web/package package/pws/assets/web

# PCF

cp -r deployment/pcf package
mkdir package/pcf/assets

cp -r api package/pcf/assets/api

pushd web
  NODE_ENV=production gulp assets
  gulp package
popd
cp -r web/package package/pcf/assets/web


# Docs

cp deployment/INSTRUCTIONS.md package

# Zip

zip -r package.zip package
rm -r package
