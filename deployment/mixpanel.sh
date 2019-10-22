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
#
set -euo pipefail

if [ $# -lt 1 ]; then
  echo 'usage: ./mixpanel.sh <script-name> ...'
  echo 'This will report the script execution to MixPanel.'
  echo 'Use ENABLE_ANALYTICS=false (skip) or ENABLE_ANALYTICS=true (send) to avoid the manual check.'
  exit 1
fi

ENABLE_ANALYTICS=${ENABLE_ANALYTICS:-unknown}
MIXPANEL_TOKEN='d4de349453cc697734eced9ebedcdb22'
PAYLOAD="{\"event\": \"Ran $1\", \"properties\": {\"token\": \"$MIXPANEL_TOKEN\", \"time\": $(date +%s)}}"
URL="https:/api.mixpanel.com/track/?data=$(echo -n "$PAYLOAD" | base64)"

case $ENABLE_ANALYTICS in
  'false')
    exit 0;
  ;;
  'true')
    echo "MixPanel response (1 means success): $(curl "$URL")";
    exit 0;
  ;;
  *)
    echo 'As the maintainers of Postfacto, we are interested in gaining more information'
    echo 'about installs so that we can make Postfacto better for you and other users.'
    echo ''
    echo "To let us know you've installed Postfacto, we would like to send the following "
    echo 'information via MixPanel:'
    echo ''
    echo "$PAYLOAD"
    echo ''
    echo -n 'Do you want to send this anonymous installation notification? [yN] '
    read -r ACCEPT
    if [[ $ACCEPT == y ]]; then
      echo ''
      echo 'Thanks for supporting Postfacto!'
      echo ''
      echo 'You can use ENABLE_ANALYTICS=true to avoid this check in the future.'
      echo ''
      echo "MixPanel response (1 means success): $(curl "$URL")"
    else
      echo 'Skipping analytics. Use ENABLE_ANALYTICS=false to avoid this check in the future.'
    fi
  ;;
esac
