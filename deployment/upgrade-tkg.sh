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
  echo "usage: ./upgrade.sh <app-name>"
  echo "This will upgrade the app on a kubernetes cluster of your choosing"
  exit 1
fi

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/mixpanel.sh" "TKG $(basename "${BASH_SOURCE[0]}")" "$@"

APP_NAME=$1

POSTGRES_PASSWORD=$(kubectl get secret ${APP_NAME}-postgresql -o jsonpath='{.data.postgresql-password}' | base64 -d)
REDIS_PASSWORD=$(kubectl get secret ${APP_NAME}-redis -o jsonpath='{.data.redis-password}' | base64 -d)
POSTFACTO_POD=$(kubectl get pod -l app.kubernetes.io/instance=${APP_NAME} -o jsonpath="{.items[0].metadata.name}")
SECRET_KEY_BASE=$(kubectl get pod ${POSTFACTO_POD} -o jsonpath='{.spec.containers[0].env[?(@.name=="SECRET_KEY_BASE")].value}')

helm upgrade $APP_NAME postfacto-*.tgz \
  --set service.type=LoadBalancer \
  --set secretKeyBase="${SECRET_KEY_BASE}" \
  --set redis.password="${REDIS_PASSWORD}" \
  --set postgresql.postgresqlPassword="${POSTGRES_PASSWORD}"

