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
  echo "usage: ./deploy.sh <app-name>"
  echo "This will deploy the app to a kubernetes cluster of your choosing"
  exit 1
fi

# The directory in which this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/mixpanel.sh" "TKG $(basename "${BASH_SOURCE[0]}")" "$@"

APP_NAME=$1
ADMIN_EMAIL="${ADMIN_EMAIL:-email@example.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-password}"

helm install "$APP_NAME" postfacto-*.tgz --set service.type=LoadBalancer

kubectl wait --for=condition=ready --timeout=120s pod -l "app.kubernetes.io/instance=$APP_NAME"
POSTFACTO_POD=$(kubectl get pod -l "app.kubernetes.io/instance=$APP_NAME" -o jsonpath="{.items[0].metadata.name}")
kubectl exec "$POSTFACTO_POD" create-admin-user "$ADMIN_EMAIL" "$ADMIN_PASSWORD"

SERVICE_IP=$(kubectl get svc "$APP_NAME" --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
export SERVICE_IP
echo "Access your application at http://$SERVICE_IP"
