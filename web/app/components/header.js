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

const React = require('react');
const types = React.PropTypes;
import Helmet from 'react-helmet';

class Header extends React.Component {
  static propTypes = {
    retro: types.object,
    config: types.object,
  };

  render() {
    const {config, retro} = this.props;
    let documentTitle = retro.name.length > 0 ? retro.name + ' - ' + config.title : config.title;
    return (
      <Helmet title={documentTitle}
              link={[{'rel': 'icon',
              'href': '/images/favicon.png?v=2'}]}/> // bump version when you update favicon.png
    );
  }
}

module.exports = Header;
