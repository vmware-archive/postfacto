#!/bin/bash

set -e

pushd api
  bundle exec rake db:create db:migrate
  ADMIN_EMAIL=email@example.com ADMIN_PASSWORD=password rake admin:create_user
popd

pushd web
  gulp local-run
popd
