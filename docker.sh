#!/bin/bash

docker run -it \
  --entrypoint /bin/bash \
  -p 3000:3000 \
  -p 4000:4000 \
  -v "$(pwd)":/postfacto \
  postfacto/postfacto:node11
