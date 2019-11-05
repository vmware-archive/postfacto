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
#
set -e


APP_VERSION=$1
if [ $# -lt 1 ]; then
  APP_VERSION="dev"
fi

sed -i.bak s/appVersion:.*/appVersion:\ $APP_VERSION/  Chart.yaml

helm repo add stable https://kubernetes-charts.storage.googleapis.com

rm -f Chart.lock # workaround for: https://github.com/helm/helm/issues/6416
helm dependency build

helm package .
