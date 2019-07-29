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
import {getMenuLabels} from '../../test_support/retro_menu_getters';
import '../../spec_helper';

import {ShowRetroPage} from './show_retro_page';

const config = {
  title: 'Retro',
  api_base_url: 'https://example.com',
  websocket_url: 'ws://websocket/url',
  contact: '',
  terms: '',
  privacy: '',
};

describe('Show retro page archives', () => {
  const retro_archives = {
    id: 13,
    name: 'retro name',
    send_archive_email: true,
    items: [
      {
        id: 2,
        description: 'archived item 1',
        vote_count: 1,
        done: false,
        category: 'happy',
        archived_at: '2016-07-18T00:00:00.000Z',
        created_at: '2016-07-11T00:00:00.000Z',
      },
      {
        id: 3,
        description: 'archived item 3',
        vote_count: 2,
        done: true,
        category: 'sad',
        archived_at: '2016-07-20T00:00:00.000Z',
        created_at: '2016-07-11T00:00:00.000Z',
      },
    ],
    action_items: [
      {
        id: 1,
        description: 'archived action 1',
        archived_at: '2016-07-18T00:00:00.000Z',
        created_at: '2016-07-11T00:00:00.000Z',
      },
      {
        id: 2,
        description: 'archived action 2',
        archived_at: '2016-07-20T00:00:00.000Z',
        created_at: '2016-07-11T00:00:00.000Z',
      },
    ],
  };

  describe('on desktop', () => {
    let dom;
    let routeToRetroArchives;

    beforeEach(() => {
      routeToRetroArchives = jest.fn();
      dom = mount((
        <MuiThemeProvider>
          <ShowRetroPage
            retro_archives={retro_archives}
            retroId="13"
            archives
            retro={retro_archives}
            config={config}
            featureFlags={{archiveEmails: true}}
            environment={{isMobile640: false}}
            getRetroArchive={jest.fn()}
            getRetro={jest.fn()}
            nextRetroItem={jest.fn()}
            archiveRetro={jest.fn()}
            hideDialog={jest.fn()}
            toggleSendArchiveEmail={jest.fn()}
            routeToRetroArchives={routeToRetroArchives}
            routeToRetroSettings={jest.fn()}
            requireRetroLogin={jest.fn()}
            showDialog={jest.fn()}
            signOut={jest.fn()}
          />
        </MuiThemeProvider>
      ));
    });

    it('renders archived items', () => {
      expect(dom.find('button.retro-back')).toIncludeText('Archives');
      expect(dom.find('.column-sad .item-text').at(0)).toIncludeText('archived item 3');
      expect(dom.find('.retro-action .action-text').at(0)).toHaveText('archived action 2');
    });

    it('does not offer deletion or input', () => {
      expect(dom.find('.action-delete')).not.toExist();
      expect(dom.find('input')).not.toExist();
    });

    it('redirects to list archives page of current retro when clicking Archived retros', () => {
      dom.find('button.retro-back').simulate('click');

      expect(routeToRetroArchives).toHaveBeenCalledWith('13');
    });

    it('shows a menu with "Sign out" if logged in', () => {
      window.localStorage.setItem('authToken', 'some-token');
      dom.setProps({}); // force update

      const menuLabels = getMenuLabels(dom);
      const lastMenuLabel = menuLabels[menuLabels.length - 1];
      expect(lastMenuLabel).toEqual('Sign out');
    });
  });

  describe('on mobile', () => {
    let dom;
    let routeToRetroArchives;

    beforeEach(() => {
      routeToRetroArchives = jest.fn();
      dom = mount((
        <MuiThemeProvider>
          <ShowRetroPage
            retro_archives={retro_archives}
            retroId="13"
            archives
            retro={retro_archives}
            config={config}
            featureFlags={{archiveEmails: true}}
            environment={{isMobile640: true}}
            getRetroArchive={jest.fn()}
            getRetro={jest.fn()}
            nextRetroItem={jest.fn()}
            archiveRetro={jest.fn()}
            hideDialog={jest.fn()}
            toggleSendArchiveEmail={jest.fn()}
            routeToRetroArchives={routeToRetroArchives}
            routeToRetroSettings={jest.fn()}
            requireRetroLogin={jest.fn()}
            showDialog={jest.fn()}
            signOut={jest.fn()}
          />
        </MuiThemeProvider>
      ));
    });

    it('does not show a desktop menu', () => {
      expect(dom.find('.retro-menu')).not.toExist();
    });

    it('redirects to list archives page when clicking back', () => {
      dom.find('button.retro-back').simulate('click');

      expect(routeToRetroArchives).toHaveBeenCalledWith('13');
    });
  });
});
