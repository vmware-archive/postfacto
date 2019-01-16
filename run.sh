#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

EXIT_SCRIPT="";
trap "eval \"\$EXIT_SCRIPT\"; sleep 1; echo 'Shutdown complete.';" EXIT

ADMIN_USER='email@example.com'
ADMIN_PASS='password'

pushd "$BASE_DIR/api" >/dev/null
  bundle exec rake db:create db:migrate
  ADMIN_EMAIL="$ADMIN_USER" ADMIN_PASSWORD="$ADMIN_PASS" rake admin:create_user
popd >/dev/null

if [[ " $* " == *' --real-auth ' ]]; then
  echo "Using real authentication; set google_oauth_client_id in config.js to use Google auth";
  unset USE_MOCK_GOOGLE
else
  export USE_MOCK_GOOGLE=true
fi

if [[ -n "$USE_MOCK_GOOGLE" ]]; then
  echo "Using mock google authentication server (specify --real-auth to use real auth)";
  export GOOGLE_AUTH_ENDPOINT=http://localhost:3100/auth
  npm --prefix="$BASE_DIR/mock-google-server" start & PID_MGS=$!
  EXIT_SCRIPT="$EXIT_SCRIPT kill $PID_MGS || true;";
fi

pushd "$BASE_DIR/api" >/dev/null
  bundle exec rails server -b 0.0.0.0 -p 4000 & PID_API=$!
  EXIT_SCRIPT="$EXIT_SCRIPT kill $PID_API || true;";
popd >/dev/null

echo;
echo "Created admin user '$ADMIN_USER' with password '$ADMIN_PASS'"
echo "Log in to http://localhost:4000/admin to administer"
echo "App will be available at http://localhost:3000/"
echo "Press Ctrl+C to stop"

# react-scripts clears console history so the above message disappears :(
npm --prefix="$BASE_DIR/web" start
