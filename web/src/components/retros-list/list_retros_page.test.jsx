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
import {MuiThemeProvider} from 'material-ui';
import {SpyDispatcher} from '../../spec_helper';

import ListRetrosPage from './list_retros_page';

describe('List Retros Page', () => {
  let dom;

  beforeEach(() => {
    dom = mount(<MuiThemeProvider><ListRetrosPage retros={createRetros(2)}/></MuiThemeProvider>);
  });

  it('shows multiple retros', () => {
    expect(dom.find('.retro-list-tile').length).toEqual(2);
  });

  it('includes a link to the show retro page', () => {
    dom.find('.retro-list-tile').at(0).simulate('click');
    expect(SpyDispatcher).toHaveReceived('routeToShowRetro');
  });
});

function createRetros(count = 1) {
  const retros = [];

  for (let x = 0; x < count; x += 1) {
    retros.push({
      id: 13 + x,
      name: `the retro name ${x + 1}`,
      slug: `slug-${x + 1}`,
      is_private: false,
      video_link: 'http://the/video/link',
      send_archive_email: false,
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
    });
  }

  return retros;
}
