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
import {shallow} from 'enzyme';
import {getMenuLabels, invokeMenuOption} from '../../test_support/retro_menu_getters';
import '../../spec_helper';

import RetroHeading from './retro_heading';

const defaultRetro = {
  id: 13,
  name: 'the retro name',
  is_private: false,
  video_link: 'http://the/video/link',
  items: [],
  action_items: [],
};

function createShallowRetroHeading(retroOverrides = {}, propOverrides = {}) {
  const retro = Object.assign(defaultRetro, retroOverrides);

  return shallow(<RetroHeading
    retro={retro}
    retroId="13"
    archives={false}
    isMobile={false}
    routeToRetroArchives={jest.fn()}
    routeToRetroSettings={jest.fn()}
    requireRetroLogin={jest.fn()}
    showDialog={jest.fn()}
    signOut={jest.fn()}
    {...propOverrides}
  />);
}

describe('RetroHeading', () => {
  describe('viewing a current retro', () => {
    it('does not display a back button', () => {
      const dom = createShallowRetroHeading({});

      expect(dom.find('.retro-back')).not.toExist();
    });

    it('includes a link to the archives if they exist', () => {
      const dom = createShallowRetroHeading({archives: [{id: 1}]});

      expect(getMenuLabels(dom)).toContain('View archives');
    });

    it('omits a link to the archives if none exist', () => {
      const dom = createShallowRetroHeading({archives: []});

      expect(getMenuLabels(dom)).not.toContain('View archives');
    });

    it('includes an option to archive if there are items', () => {
      const dom = createShallowRetroHeading({items: [{id: 1}]});

      expect(getMenuLabels(dom)).toContain('Archive this retro');
    });

    it('omits an option to archive if there are no items', () => {
      const dom = createShallowRetroHeading({items: []});

      expect(getMenuLabels(dom)).not.toContain('Archive this retro');
    });

    it('dispatches showDialog when the archive link is clicked', () => {
      const showDialog = jest.fn();
      const dom = createShallowRetroHeading({items: [{id: 1}]}, {showDialog});

      invokeMenuOption(dom, 'Archive this retro');

      expect(showDialog).toHaveBeenCalledWith({
        title: 'You\'re about to archive this retro.',
        message: 'Are you sure?',
      });
    });

    describe('when there is a video link', () => {
      it('shows the video button', () => {
        const dom = createShallowRetroHeading({video_link: 'http://the/video/link'});
        expect(dom.find('.video-button')).toExist();
      });
    });

    describe('when there is not a video link', () => {
      it('hides the video button', () => {
        const dom = createShallowRetroHeading({video_link: null});
        expect(dom.find('.video-button')).not.toExist();
      });
    });
  });

  describe('viewing an archived retro', () => {
    let dom;

    beforeEach(() => {
      dom = createShallowRetroHeading({}, {archives: true});
    });

    it('displays a back button', () => {
      expect(dom.find('.retro-back')).toExist();
    });

    it('displays a restricted menu', () => {
      expect(getMenuLabels(dom)).toEqual(['Retro settings']);
    });
  });
});
