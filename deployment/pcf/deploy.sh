#!/bin/bash

set -e

cf push -f deployment/pcf/config/manifest-api.yml -p api
cf run-task {{api-app-name}} 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'

pushd web
  NODE_ENV=production gulp assets
  gulp package
  cp ../deployment/pcf/config/config.js package
popd

cf push -f deployment/pcf/config/manifest-web.yml -p web/package
