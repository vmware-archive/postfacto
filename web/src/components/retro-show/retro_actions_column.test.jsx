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
import '../../spec_helper';

import RetroActionsColumn from './retro_actions_column';

const retroId = 'retro-slug-123';
const retro = {
  id: 123,
  name: 'the retro name',
  video_link: 'http://the/video/link',
  items: [
    {
      id: 1,
      description: 'the happy retro item',
      category: 'happy',
      created_at: '2016-08-18T12:00:00.000Z',
      vote_count: 10,
    },
  ],
  action_items: [
    {
      id: 1,
      description: 'action item 1',
      done: true,
      created_at: '2016-08-18T12:01:00.000Z',
    },
    {
      id: 2,
      description: 'action item 2',
      done: false,
      created_at: '2016-08-18T12:02:00.000Z',
    },
    {
      id: 3,
      description: 'action item 3',
      done: false,
      created_at: '2016-08-11T12:03:00.000Z',
    },
    {
      id: 4,
      description: 'action item 4',
      done: false,
      created_at: '2016-08-10T12:04:00.000Z',
    },
    {
      id: 5,
      description: 'action item 5',
      done: false,
      created_at: '2016-07-15T12:05:00.000Z',
    },
    {
      id: 6,
      description: 'action item 6',
      done: false,
      created_at: '2016-07-15T12:06:00.000Z',
    },
    {
      id: 7,
      description: 'action item 7',
      done: false,
      created_at: '2016-07-01T12:07:00.000Z',
    },
  ],
};

function mockDate(date) {
  global.Date.now = () => date.getTime();
}

describe('RetroActionsColumn Current', () => {
  let dom;

  beforeEach(() => {
    mockDate(new Date(2016, 7, 18));
    dom = mount(<RetroActionsColumn retroId={retroId} retro={retro} category="current"/>);
  });

  it('displays the current date in column header', () => {
    expect(dom.find('.retro-action-list-header')).toIncludeText('Today (August 18)');
  });

  it('renders current items in descending order', () => {
    const actions = dom.find('.retro-action .action-text');
    expect(actions.length).toEqual(2);
    expect(actions.at(0)).toIncludeText('action item 2');
    expect(actions.at(1)).toIncludeText('action item 1');
  });
});

describe('RetroActionsColumn last-week', () => {
  let dom;

  beforeEach(() => {
    mockDate(new Date(2016, 7, 18));
  });

  describe('multiple action items from different dates', () => {
    beforeEach(() => {
      dom = mount(<RetroActionsColumn retroId={retroId} retro={retro} category="last-week"/>);
    });

    it('displays the last week date in column header', () => {
      expect(dom.find('.retro-action-list-header')).toIncludeText('August 11');
    });

    it('renders items from the time period', () => {
      expect(dom.find('.retro-action').length).toEqual(1);
    });
  });

  describe('all action items on the same day', () => {
    const retro_without_older = {
      id: 123,
      name: 'the retro name',
      video_link: 'http://the/video/link',
      items: [
        {
          id: 1,
          description: 'the happy retro item',
          category: 'happy',
          created_at: '2016-08-18T12:00:00.000Z',
          vote_count: 10,
        },
      ],
      action_items: [
        {
          id: 1,
          description: 'action item 1',
          done: true,
          created_at: '2016-08-18T12:00:00.000Z',
        },
        {
          id: 2,
          description: 'action item 2',
          done: false,
          created_at: '2016-08-18T12:00:00.000Z',
        },
      ],
    };

    it('renders no items', () => {
      mockDate(new Date(2016, 7, 18));
      dom = mount(<RetroActionsColumn retroId={retroId} retro={retro_without_older} category="last-week"/>);
      expect(dom.find('.retro-action').length).toEqual(0);
    });
  });
});

describe('RetroActionsColumn older', () => {
  let dom;

  beforeEach(() => {
    mockDate(new Date(2016, 7, 18));
    dom = mount(<RetroActionsColumn retroId={retroId} retro={retro} category="older"/>);
  });

  it('displays a column header', () => {
    expect(dom.find('.retro-action-list-header')).toIncludeText('Older');
  });

  it('renders items from the time period', () => {
    expect(dom.find('.retro-action').length).toEqual(4);
  });
});

describe('RetroActionsColumn Current Archive', () => {
  let dom;

  beforeEach(() => {
    mockDate(new Date(2016, 7, 18));
    dom = mount(<RetroActionsColumn retroId={retroId} retro={retro} category="current" archives/>);
  });

  describe('column header', () => {
    it('displays a column header', () => {
      expect(dom.find('.retro-action-list-header')).toIncludeText('Completed action items');
    });

    it('does not allow modifications', () => {
      expect(dom.find('.action-delete').length).toEqual(0);
    });
  });
});

describe('RetroActionsColumn last-week Archive', () => {
  let dom;

  beforeEach(() => {
    mockDate(new Date(2016, 7, 18));
    dom = mount(<RetroActionsColumn retroId={retroId} retro={retro} category="last-week" archives/>);
  });

  it('is empty', () => {
    expect(dom.find('.retro-action').length).toEqual(0);
  });
});
