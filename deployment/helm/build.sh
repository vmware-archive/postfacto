#!/bin/sh
set -e

helm repo add stable https://kubernetes-charts.storage.googleapis.com

rm Chart.lock # workaround for: https://github.com/helm/helm/issues/6416
helm dependency build

helm package .