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
import ReactDOM from 'react-dom';
import '../spec_helper';

import ShowRetroPage from './show_retro_page';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

describe('Retro settings', () => {
  let originalGetIsMobile;

  beforeEach(() => {
    let retro = createRetro();

    originalGetIsMobile = ShowRetroPage.prototype.getIsMobile;
    ShowRetroPage.prototype.getIsMobile = () => false;
    window.localStorage.setItem('authToken', 'some-token');

    ReactDOM.render(<MuiThemeProvider>
      <ShowRetroPage retro={retro} retroId="13" archives={false} config={global.Retro.config} featureFlags={{archiveEmails: true}}/>
    </MuiThemeProvider>, root);
  });

  afterEach(() => {
    ShowRetroPage.prototype.getIsMobile = originalGetIsMobile;
  });

  it('should have retro settings menu item', () => {
    $('.retro-menu button').simulate('click');
    expect($('.retro-menu-item')[1]).toContainText('Retro settings');
  });

  describe('when user has an api token', () => {
    beforeEach(() => {
      window.localStorage.setItem('apiToken-13', 'some-token');
    });

    afterEach(() => {
      window.localStorage.clear();
    });

    it('should redirect to retro settings page', () => {
      $('.retro-menu button').simulate('click');
      $($('.retro-menu-item')[1]).simulate('click');

      expect('routeToRetroSettings').toHaveBeenDispatchedWith({
        type: 'routeToRetroSettings',
        data: {retro_id: '13'}
      });
    });
  });

  describe('when user is not signed in', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('should redirect to the retro login page', () => {
      $('.retro-menu button').simulate('click');
      $($('.retro-menu-item')[1]).simulate('click');

      expect('requireRetroLogin').toHaveBeenDispatchedWith({
        type: 'requireRetroLogin',
        data: {retro_id: '13'}
      });
    });
  });
});

function createRetro() {
  return {
    id: 13,
    name: 'the retro name',
    video_link: 'http://the/video/link',
    items: [
      {
        id: 1,
        description: 'the happy retro item',
        category: 'happy',
      },
      {
        id: 2,
        description: 'the meh retro item',
        category: 'meh',
      },
      {
        id: 3,
        description: 'the sad retro item',
        category: 'sad',
      },
    ],
    action_items: [
      {
        id: 1,
        description: 'action item 1',
        done: true,
      },
      {
        id: 2,
        description: 'action item 2',
        done: false,
      },
    ],
  };
}
