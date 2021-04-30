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

export BASE_DIR="$(dirname "$0")"
export RAILS_ENV="development"

# Parse configuration

ADMIN_EMAIL="${ADMIN_EMAIL:-email@example.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-password}"

INFO=""

USE_MOCK_GOOGLE=false
if [[ " $* " == *' --no-auth '* ]]; then
  INFO+="Disabling login capability (create retros via admin interface)"$'\n'
  GOOGLE_OAUTH_CLIENT_ID=""
elif [[ -n "$GOOGLE_OAUTH_CLIENT_ID" ]]; then
  echo "Using Google OAuth authentication"$'\n'
else
  INFO+="Using mock Google authentication server"$'\n'
  INFO+=" - specify --no-auth to disable login"$'\n'
  INFO+=" - set GOOGLE_OAUTH_CLIENT_ID to use real Google OAuth"$'\n'
  USE_MOCK_GOOGLE=true
fi

# Migrate database and create Admin user

pushd "$BASE_DIR/api" >/dev/null
  echo "Migrating database..."
  bundle exec rake db:create db:migrate
  ADMIN_EMAIL="$ADMIN_EMAIL" ADMIN_PASSWORD="$ADMIN_PASSWORD" bundle exec rake admin:create_user
popd >/dev/null

export USE_MOCK_GOOGLE
export GOOGLE_OAUTH_CLIENT_ID

# Launch content server for frontend

TMUX_COMMAND="tmux new-session -s postfacto_run npm --prefix=\"\$BASE_DIR/web\" start"

# Launch API

TMUX_COMMAND+=" \; split-window -v /bin/bash -c 'cd \"\$BASE_DIR/api\" && echo \"API\" && bundle exec rails server -b 0.0.0.0 -p 4000 -e \"\$RAILS_ENV\"'"

# Launch mock auth server if needed

if [[ "$USE_MOCK_GOOGLE" == "true" ]]; then
  export GOOGLE_AUTH_ENDPOINT="http://localhost:3100/auth"
  TMUX_COMMAND+=" \; split-window -v npm --prefix=\"\$BASE_DIR/mock-google-server\" start"
fi

INFO+=$'\n'
INFO+="Created admin user '$ADMIN_EMAIL' with password '$ADMIN_PASSWORD'"$'\n'
INFO+="Log in to http://localhost:4000/admin to administer"$'\n'
INFO+="App will be available at http://localhost:3000/"$'\n'
INFO+="Press 'q' to stop all services"
export INFO

clear

TMUX_COMMAND+=" \; split-window -v /bin/bash -c 'echo \"\$INFO\" | less; tmux kill-session -t postfacto_run'"
TMUX_COMMAND+=" \; select-layout even-vertical"
/bin/bash -c "$TMUX_COMMAND"
