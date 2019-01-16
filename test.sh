#!/bin/bash

set -e

# API Unit Tests
pushd api
  bundle exec rake db:create db:migrate
  bundle exec rake
popd

# Frontend Unit Tests
CI=true npm --prefix=web test

# E2E Tests
export USE_MOCK_GOOGLE=true
pushd e2e
  bundle exec rspec
popd
