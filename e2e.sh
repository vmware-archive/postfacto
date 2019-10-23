#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

export RAILS_ENV="test"
export USE_MOCK_GOOGLE=true
export BASE_WEB_URL="http://localhost:4000"
export RETRO_ADMIN_BASE_URL="http://localhost:4000/admin"
export GOOGLE_AUTH_ENDPOINT="http://localhost:3100/auth"

API_LOG="$BASE_DIR/test-api-server.log";
WEB_LOG="$BASE_DIR/test-web-server.log";

# Update database

pushd "$BASE_DIR/api" >/dev/null
  echo 'Dropping test database...'
  bundle exec rake db:drop
  echo 'Migrating test database...'
  bundle exec rake db:create db:migrate db:test:prepare
  echo 'Seeding test data...'
  bundle exec rake db:seed
popd >/dev/null

# Set up trap to ensure spawned processes are killed in all situations

SPAWNED_PIDS="";

kill_pid_tree() {
  # Behaviour of react_scripts node servers makes them hard to kill;
  # must identify child and grandchild processes
  PID="$1"
  SUBPID1="$(pgrep -P "$PID" || true)"
  if [[ -n "$SUBPID1" ]]; then
    SUBPID2="$(pgrep -P "$SUBPID1" || true)"
    if [[ -n "$SUBPID2" ]]; then
      kill "$SUBPID2" >/dev/null 2>&1 || true
    fi
    kill "$SUBPID1" >/dev/null 2>&1 || true
  fi
  kill "$PID" >/dev/null 2>&1 || true
}

kill_spawned() {
  if [[ -n "$SPAWNED_PIDS" ]]; then
    echo "Shutting down child processes $SPAWNED_PIDS"
    for PID in $SPAWNED_PIDS; do
      kill_pid_tree "$PID"
    done
    SPAWNED_PIDS=""
  fi
}

register_spawned() {
  SPAWNED_PIDS="$SPAWNED_PIDS $1"
}

if [[ "$EPHEMERAL_CONTAINER" != "true" ]]; then
  # If we kill the script or a test fails, ensure it is cleaned up
  # (only necessary if we are in a long-lived container, i.e. not in CI)
  trap "kill_spawned; sleep 1; echo 'e2e tests failed :('; false;" EXIT
fi

# Launch mock auth server

npm --prefix="$BASE_DIR/mock-google-server" start &
register_spawned $!

# Create static content

echo 'Building frontend in E2E test mode...'
rm -rf "$BASE_DIR/api/client/*"
npm --prefix="$BASE_DIR/web" run build
cp -a "$BASE_DIR/web/build/." "$BASE_DIR/api/client"

# Launch API

pushd "$BASE_DIR/api" >/dev/null
  echo 'Launching API...'
  echo > "$API_LOG"
  bundle exec rails server -b 0.0.0.0 -p 4000 -e "$RAILS_ENV" >> "$API_LOG" 2>&1 &
  register_spawned $!

  echo 'Waiting for API...'
  ( tail -f -n10 "$API_LOG" & ) | grep -q 'Listening' || true
popd >/dev/null

# Run tests

pushd "$BASE_DIR/e2e" >/dev/null
  echo 'Running E2E tests...'
  bundle exec rspec
popd >/dev/null

# Shutdown services

kill_spawned;

if [[ "$EPHEMERAL_CONTAINER" != "true" ]]; then
  trap - EXIT
fi

# Successful, so remove log files
rm "$API_LOG" >/dev/null || true
rm "$WEB_LOG" >/dev/null || true

sleep 1;
echo "E2E tests passed"
