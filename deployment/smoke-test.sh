#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

if [ $# -lt 4 ]; then
  echo "usage: ./smoke-test.sh <base-web-url> <base-admin-url> <admin-email> <admin-password>"
  echo "This will run the smoke tests for your deployed instance of Postfacto."
  exit 1
fi

export BASE_WEB_URL=${1}
export BASE_ADMIN_URL=${2}
export ADMIN_EMAIL=${3}
export ADMIN_PASSWORD=${4}

APP_VERSION="dev"
if [ -f "$BASE_DIR/VERSION" ]; then
    APP_VERSION=$(cat "$BASE_DIR/VERSION")
fi

echo 'Running smoke tests...'

docker run -it --rm \
  -e BASE_WEB_URL=$BASE_WEB_URL \
  -e BASE_ADMIN_URL=$BASE_ADMIN_URL \
  -e ADMIN_EMAIL=$ADMIN_EMAIL \
  -e ADMIN_PASSWORD=$ADMIN_PASSWORD \
  postfacto/smoke:$APP_VERSION

echo "Smoke tests passed"