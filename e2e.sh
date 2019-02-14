#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

export RAILS_ENV="test"
export USE_MOCK_GOOGLE=true
export BASE_WEB_URL="http://localhost:3000"
export RETRO_ADMIN_BASE_URL="http://localhost:4000/admin"
export GOOGLE_AUTH_ENDPOINT="http://localhost:3100/auth"

API_LOG="$BASE_DIR/test-api-server.log";
WEB_LOG="$BASE_DIR/test-web-server.log";

# Update database

pushd "$BASE_DIR/api" >/dev/null
  echo 'Migrating test database...'
  bundle exec rake db:create db:migrate db:test:prepare
  echo 'Seeding test data...'
  bundle exec rake db:seed
popd >/dev/null

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

if [[ "$EPHEMERAL_CONTAINER" != "true" ]]; then
  trap "kill_spawned; sleep 1; echo 'Shutdown complete.';" INT TERM EXIT
fi

# Launch mock auth server

npm --prefix="$BASE_DIR/mock-google-server" start &
register_spawned $!

# Launch API

pushd "$BASE_DIR/api" >/dev/null
  echo 'Launching API...'
  echo > "$API_LOG"
  bundle exec rails server -b 0.0.0.0 -p 4000 -e "$RAILS_ENV" >> "$API_LOG" 2>&1 &
  register_spawned $!

  echo 'Waiting for API...'
  ( tail -f -n10 "$API_LOG" & ) | grep -q 'Listening'
popd >/dev/null

# Launch static content

echo 'Building frontend in E2E test mode...'
npm --prefix="$BASE_DIR/web" run build

echo 'Launching frontend...'
echo > "$WEB_LOG"
npm --prefix="$BASE_DIR/web" run serve-built >> "$WEB_LOG" 2>&1 &
register_spawned $!

echo 'Waiting for frontend...'
( tail -f -n10 "$WEB_LOG" & ) | grep -q 'Accepting connections'

# Run tests

pushd "$BASE_DIR/e2e" >/dev/null
  echo 'Running E2E tests...'
  bundle exec rspec
popd >/dev/null

# Shutdown services

if [[ "$EPHEMERAL_CONTAINER" == "true" ]]; then
  # Don't need to worry too much about shutting down services,
  # since container will disappear soon anyway
  echo "Shutting down child processes $SPAWNED_PIDS"
  for PID in $SPAWNED_PIDS; do
    kill -SIGINT "$PID" >/dev/null || true
  done
else
  kill_spawned
  trap - INT TERM EXIT
fi

# Successful, so remove log files
rm "$API_LOG"
rm "$WEB_LOG"

sleep 1;
echo "E2E tests passed"
