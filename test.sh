#!/bin/bash
#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
