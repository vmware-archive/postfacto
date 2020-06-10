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
mkdir -p "$(pwd)/docker_node_modules"

docker run -it \
  --entrypoint /bin/bash \
  -p 3000:3000 \
  -p 4000:4000 \
  -v "$(pwd)":/postfacto \
  -v "$(pwd)/docker_node_modules:/postfacto/web/node_modules" \
  postfacto/dev:2.6.3-12.6.0
