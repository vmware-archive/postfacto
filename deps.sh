#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

pushd "$BASE_DIR/api" >/dev/null
  bundle install --without production
popd >/dev/null

npm --prefix="$BASE_DIR/web" install
npm --prefix="$BASE_DIR/mock-google-server" install

pushd "$BASE_DIR/e2e" >/dev/null
  bundle install
popd >/dev/null
