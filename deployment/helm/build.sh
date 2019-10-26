#!/bin/sh
set -e

VERSION=$1

if [ $# -lt 1 ]; then
  echo "usage: ./build.sh <version>"
  echo "Builds the chart writing the given version as the app and chart version"
  exit 1
fi

sed -i.bak s/version:.*/version:\ $VERSION/  Chart.yaml
sed -i.bak s/appVersion:.*/appVersion:\ $VERSION/  Chart.yaml

helm repo add stable https://kubernetes-charts.storage.googleapis.com

rm -f Chart.lock # workaround for: https://github.com/helm/helm/issues/6416
helm dependency build

helm package .