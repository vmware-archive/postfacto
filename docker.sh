#!/bin/bash

mkdir -p "$(pwd)/docker_node_modules"

docker run -it \
  --entrypoint /bin/bash \
  -p 3000:3000 \
  -p 4000:4000 \
  -v "$(pwd)":/postfacto \
  -v "$(pwd)/docker_node_modules:/postfacto/web/node_modules" \
  postfacto/dev:2.6.3-12.6.0
