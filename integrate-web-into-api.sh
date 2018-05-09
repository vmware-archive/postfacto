#!/bin/bash

pushd web
  NODE_ENV=production gulp assets
  gulp package
  cp ../deployment/pws/config/config.js package
popd

cp web/package/index.html api/app/views/pages/index.html
cp web/package/application.css api/public/application.css
cp web/package/application.js api/public/application.js
cp web/package/humans.txt api/public/humans.txt
