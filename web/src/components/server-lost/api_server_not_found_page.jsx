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
import {connect} from 'react-redux';
import types from 'prop-types';
import faceDeadSvg from '../../images/face-dead.svg';
import {setNotFound} from '../../redux/actions/main_actions';

export default class ApiServerNotFoundPage extends React.PureComponent {
  static propTypes = {
    resetApiServerNotFound: types.func.isRequired,
  };


  componentWillUnmount() {
    this.props.resetApiServerNotFound();
  }

  render() {
    return (
      <div className="error-page">
        <div className="row" style={{marginTop: '180px'}}>
          <div className="small-centered medium-8 small-10 columns">
            <div className="image">
              <img src={faceDeadSvg} alt="Error"/>
            </div>
            <h1>Oh no! It's broken</h1>
            <p>Try refreshing the page, or come back later.</p>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  resetApiServerNotFound: () => dispatch(setNotFound({api_server_not_found: false})),
});

const ConnectedApiServerNotFoundPage = connect(null, mapDispatchToProps)(ApiServerNotFoundPage);
export {ApiServerNotFoundPage, ConnectedApiServerNotFoundPage};
