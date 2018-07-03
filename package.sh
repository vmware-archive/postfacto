#!/bin/bash

set -e

mkdir package

# PWS

cp -r deployment/pws package

cp -r api package/pws/assets/api

pushd web
  NODE_ENV=production gulp assets
  gulp package
popd
cp -r package package/pws/assets/web

cp DEPLOYMENT.md package
