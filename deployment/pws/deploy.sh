#!/bin/bash

set -e

cf push -f deployment/pws/config/manifest-api.yml -p api
cf run-task {{api-app-name}} 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'

pushd web
  NODE_ENV=production gulp assets
  gulp package
  cp ../deployment/pws/config/config.js package
popd

cf push -f deployment/pws/config/manifest-web.yml -p web/package
