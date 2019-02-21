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
import {mount} from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {SpyDispatcher} from '../../spec_helper';

import ShowRetroPage from './show_retro_page';

function getMenuItems() {
  // <Popover> renders separately, so hacks are needed:
  return document.getElementsByClassName('retro-menu-item');
}

const config = {title: 'Retro', api_base_url: 'https://example.com', websocket_url: 'ws://websocket/url'};

describe('Retro settings', () => {
  let originalGetIsMobile;
  let dom;

  beforeEach(() => {
    const retro = {
      id: 13,
      name: 'the retro name',
      video_link: 'http://the/video/link',
      items: [],
      action_items: [],
    };

    originalGetIsMobile = ShowRetroPage.prototype.getIsMobile;
    ShowRetroPage.prototype.getIsMobile = () => false;
    window.localStorage.setItem('authToken', 'some-token');

    dom = mount(
      <MuiThemeProvider>
        <ShowRetroPage
          retro={retro}
          retroId="13"
          archives={false}
          config={config}
          featureFlags={{archiveEmails: true}}
        />
      </MuiThemeProvider>,
    );
  });

  afterEach(() => {
    ShowRetroPage.prototype.getIsMobile = originalGetIsMobile;
  });

  describe('retro settings menu item', () => {
    let button;

    beforeEach(() => {
      dom.find('.retro-menu button').simulate('click');
      const items = getMenuItems();
      button = items[0];
    });

    it('has a label', () => {
      expect(button.innerHTML).toMatch(/\bRetro settings\b/);
    });

    it('redirects to retro settings page if logged in', () => {
      window.localStorage.setItem('apiToken-13', 'some-token');

      button.click();

      expect(SpyDispatcher).toHaveReceived({
        type: 'routeToRetroSettings',
        data: {retro_id: '13'},
      });
    });

    it('redirects to retro login page if not logged in', () => {
      button.click();

      expect(SpyDispatcher).toHaveReceived({
        type: 'requireRetroLogin',
        data: {retro_id: '13'},
      });
    });
  });
});
