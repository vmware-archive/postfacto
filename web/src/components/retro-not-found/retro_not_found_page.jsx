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
import {setNotFound} from '../../redux/actions/main_actions';
import {newRetro} from '../../redux/actions/router_actions';

export default class RetroNotFoundPage extends React.Component {
  static propTypes = {
    resetRetroNotFound: types.func.isRequired,
    redirectToRetroCreatePage: types.func.isRequired,
  };

  componentWillUnmount() {
    this.props.resetRetroNotFound();
  }

  onCreateNewRetroClicked = () => {
    this.props.redirectToRetroCreatePage();
  };

  render() {
    return (
      <div className="error-page">
        <div className="row" style={{marginTop: '180px'}}>
          <div className="small-centered medium-8 small-10 columns">
            <h1>Project not found.</h1>
            <p>Unfortunately, we couldn't find that project. If you've created a project already, double-check your URL.</p>
            <p>If you haven't created a project, why don't you create one?</p>
            <div className="row">
              <button
                className="retro-form-submit expanded button"
                type="button"
                style={{fontSize: '1.1rem'}}
                onClick={this.onCreateNewRetroClicked}
              >
                Create a Project
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  resetRetroNotFound: () => dispatch(setNotFound({retro_not_found: false})),
  redirectToRetroCreatePage: () => dispatch(newRetro()),
});

const ConnectedRetroNotFoundPage = connect(null, mapDispatchToProps)(RetroNotFoundPage);
export {RetroNotFoundPage, ConnectedRetroNotFoundPage};
