#!/bin/bash

set -e

cf push -f config/manifest-api.yml -p api
cf run-task {{api-app-name}} 'ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user'

cp config/config.js package
cf push -f config/manifest-web.yml -p web/package
