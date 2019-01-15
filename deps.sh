#!/bin/bash

set -e

pushd api
  bundle install --without production
popd

pushd web
  npm install
popd

pushd mock-google-server
  npm install
popd

pushd e2e
  bundle install
popd
