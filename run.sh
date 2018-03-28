#!/bin/bash

set -e

pushd api
  bundle exec rake db:create db:migrate
popd

pushd web
  gulp local-run
popd
