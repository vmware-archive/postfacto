#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

# Parse configuration

ADMIN_USER="${ADMIN_USER:-email@example.com}"
ADMIN_PASS="${ADMIN_PASS:-password}"

USE_MOCK_GOOGLE=false
if [[ " $* " == *' --no-auth '* ]]; then
  echo "Disabling login capability (create retros via admin interface)"
  GOOGLE_OAUTH_CLIENT_ID=""
elif [[ -n "$GOOGLE_OAUTH_CLIENT_ID" ]]; then
  echo "Using Google OAuth authentication"
else
  echo "Using mock Google authentication server"
  echo " - specify --no-auth to disable login"
  echo " - set GOOGLE_OAUTH_CLIENT_ID to use real Google OAuth"
  USE_MOCK_GOOGLE=true
fi

# Migrate database and create Admin user

pushd "$BASE_DIR/api" >/dev/null
  echo "Migrating database..."
  bundle exec rake db:create db:migrate
  ADMIN_EMAIL="$ADMIN_USER" ADMIN_PASSWORD="$ADMIN_PASS" rake admin:create_user
popd >/dev/null

export USE_MOCK_GOOGLE
export GOOGLE_OAUTH_CLIENT_ID

# Set up trap to ensure spawned processes are killed in all situations

SPAWNED_PIDS="";
kill_spawned() {
  if [[ -n "$SPAWNED_PIDS" ]]; then
    echo "Shutting down child processes $SPAWNED_PIDS"
    for PID in $SPAWNED_PIDS; do
      kill -SIGINT "$PID" >/dev/null || true
    done
    pkill -P $$ >/dev/null # try really hard to kill everything
    kill 0 >/dev/null # why won't you die?
    SPAWNED_PIDS=""
  fi
}
register_spawned() {
  SPAWNED_PIDS="$SPAWNED_PIDS $1"
}

trap "kill_spawned; sleep 1; echo 'Shutdown complete.';" INT TERM EXIT

# Launch mock auth server if needed

if [[ "$USE_MOCK_GOOGLE" == "true" ]]; then
  export GOOGLE_AUTH_ENDPOINT="http://localhost:3100/auth"
  npm --prefix="$BASE_DIR/mock-google-server" start &
  register_spawned $!
fi

# Launch API

pushd "$BASE_DIR/api" >/dev/null
  bundle exec rails server -b 0.0.0.0 -p 4000 -e "$RAILS_ENV" &
  register_spawned $!
popd >/dev/null

echo
echo "Created admin user '$ADMIN_USER' with password '$ADMIN_PASS'"
echo "Log in to http://localhost:4000/admin to administer"
echo "App will be available at http://localhost:3000/"
echo "Press Ctrl+C to stop"
echo

# Launch content server for frontend

# react-scripts clears console history so the above message disappears :(
npm --prefix="$BASE_DIR/web" start
