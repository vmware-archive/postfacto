#!/bin/bash

set -e

pushd api
  bundle exec rake
popd

pushd web
  gulp spec-app
  gulp local-acceptance
popd
