/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import types from 'prop-types';
import Helmet from 'react-helmet';

const Header = ({config, retro}) => (
  <Helmet
    title={retro.name.length > 0 ? retro.name + ' - ' + config.title : config.title}
    link={[
      {'rel': 'icon', 'href': '/images/favicon.png?v=2'},
      {'type': 'text/plain', 'rel': 'author', 'href': '/humans.txt'},
    ]}
  />
);

Header.propTypes = {
  retro: types.object,
  config: types.object,
};

export default Header;
