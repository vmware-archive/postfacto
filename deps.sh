#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

echo "Installing API dependencies..."
pushd "$BASE_DIR/api" >/dev/null
  bundle install --without production
popd >/dev/null

echo "Installing frontend dependencies..."
npm --prefix="$BASE_DIR/web" install

echo "Installing mock google server dependencies..."
npm --prefix="$BASE_DIR/mock-google-server" install

echo "Installing E2E test dependencies..."
pushd "$BASE_DIR/e2e" >/dev/null
  bundle install
popd >/dev/null

echo "All dependencies installed."
