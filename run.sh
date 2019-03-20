#!/bin/bash

set -e

BASE_DIR="$(dirname "$0")"

# Parse configuration

ADMIN_USER="${ADMIN_USER:-email@example.com}"
ADMIN_PASS="${ADMIN_PASS:-password}"

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
  ADMIN_EMAIL="$ADMIN_USER" ADMIN_PASSWORD="$ADMIN_PASS" bundle exec rake admin:create_user
popd >/dev/null

export BASE_DIR
export RAILS_ENV
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
INFO+="Created admin user '$ADMIN_USER' with password '$ADMIN_PASS'"$'\n'
INFO+="Log in to http://localhost:4000/admin to administer"$'\n'
INFO+="App will be available at http://localhost:3000/"$'\n'
INFO+="Press 'q' to stop all services"
export INFO

clear

TMUX_COMMAND+=" \; split-window -v /bin/bash -c 'echo \"\$INFO\" | less; tmux kill-session -t postfacto_run'"
TMUX_COMMAND+=" \; select-layout even-vertical"
/bin/bash -c "$TMUX_COMMAND"
