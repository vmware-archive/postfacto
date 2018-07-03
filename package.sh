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

cp deployment/INSTRUCTIONS.md package
