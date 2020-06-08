#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the asset url of the latest draft
asset_url=$(curl -u $GITHUB_USERNAME:$ACCESS_TOKEN \
          --header "Accept: application/json" \
          https://api.github.com/repos/pivotal/postfacto/releases \
          | jq --raw-output '[.[] | select(.draft==true)][0].assets[0].url')

# Download asset
curl --location --silent --show-error \
          -u $GITHUB_USERNAME:$ACCESS_TOKEN \
          --header "Accept: application/octet-stream" \
          --output $SCRIPT_DIR/package.zip \
          $asset_url