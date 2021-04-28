#!/bin/sh
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the asset url of the latest draft
ASSET_URL=$(curl \
          --header "Authorization: Bearer $GITHUB_TOKEN" \
          --header "Accept: application/json" \
          https://api.github.com/repos/pivotal/postfacto/releases \
          | jq --raw-output '[[.[] | select(.draft==true)] | first.assets | .[] | select(.name=="package.zip")] | first.url')

# Download asset
curl --location --silent --show-error \
          --header "Authorization: Bearer $GITHUB_TOKEN" \
          --header "Accept: application/octet-stream" \
          --output "$SCRIPT_DIR/package.zip" \
          "$ASSET_URL"
