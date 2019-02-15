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

import RetroColumn from './retro_column';
import ReactDOM from 'react-dom';
import '../spec_helper';

const retro = {
  id: 123,
  name: 'the retro name',
  video_link: 'http://the/video/link',
  items: [
    {
      id: 1,
      description: 'the happy retro item',
      category: 'happy',
      created_at: '2016-07-19T00:00:00.000Z',
      vote_count: 10
    },
    {
      id: 2,
      description: 'the 2nd happy retro item',
      category: 'happy',
      created_at: '2016-07-18T00:00:00.000Z',
      vote_count: 9
    },
    {
      id: 3,
      description: 'the meh retro item',
      category: 'meh'
    },
    {
      id: 4,
      description: 'the sad retro item',
      category: 'sad'
    },
  ]
};
describe('RetroColumn', () => {
  beforeEach(() => {
    ReactDOM.render(<RetroColumn retro={retro} retroId={'retro-slug-123'} category="happy" isMobile={false}/>, root);
  });

  describe('creating a retro', () => {
    it('column has all its items', () => {
      expect($('.column-happy .retro-item-add-input').attr('placeholder')).toEqual('I\'m glad that...');
      expect('.column-happy .retro-item').toHaveLength(2);
    });
  });

  it('should order items by time', () => {
    expect($('.column-happy .retro-item .item-text').get(0).textContent).toEqual('the happy retro item');
    expect($('.column-happy .retro-item .item-text').get(1).textContent).toEqual('the 2nd happy retro item');
  });

});
