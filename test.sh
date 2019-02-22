#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

# API Unit Tests
pushd "$BASE_DIR/api" >/dev/null
  bundle exec rake db:create db:migrate
  echo
  echo "API Unit Tests:"
  echo
  bundle exec rake
popd >/dev/null

# Frontend Linting
echo
echo "Frontend Lint:"
echo
CI=true npm --prefix="$BASE_DIR/web" run lint

# Frontend Unit Tests
echo
echo "Frontend Unit Tests:"
echo
CI=true npm --prefix="$BASE_DIR/web" test

# E2E Tests

echo
echo "End-to-end Tests:"
echo
"$BASE_DIR/e2e.sh"

# Done

echo
echo "All tests passed :)"
