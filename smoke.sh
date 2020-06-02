#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

if [ $# -lt 4 ]; then
  echo $@
  echo "usage: ./smoke.sh <base-web-url> <base-admin-url> <admin-email> <admin-password>"
  echo "This will run the smoke tests for your deployed instance of Postfacto."
  exit 1
fi

export BASE_WEB_URL=${1}
export BASE_ADMIN_URL=${2}
export ADMIN_EMAIL=${3}
export ADMIN_PASSWORD=${4}

pushd "$BASE_DIR/smoke" >/dev/null
  echo 'Running smoke tests...'
  bundle exec rspec
popd >/dev/null

sleep 1;
echo "Smoke tests passed"
