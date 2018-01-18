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
const {Actions} = require('p-flux');

class ApiServerNotFoundPage extends React.Component {

  componentWillUnmount() {
    Actions.resetApiServerNotFound();
  }

  render() {
    return (
      <div className="error-page">
        <div className="row" style={{marginTop:'180px'}}>
          <div className="small-centered medium-8 small-10 columns">
            <div className="image">
              <img src={require('../images/face-dead.svg')}/>
            </div>
            <h1>Oh no! It's broken</h1>
            <p>Try refreshing the page, or come back later.</p>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ApiServerNotFoundPage;
