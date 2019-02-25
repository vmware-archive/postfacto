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

import EmojiSelector from './emoji_selector';

import '../../spec_helper';

describe('EmojiSelector', () => {
  it('should render the emojis headers by their name in order', () => {
    const wrapper = mount(<EmojiSelector onSelect={() => {}}/>);
    const headers = wrapper.find('.emoji-selector-group h1');

    expect(headers.length).toEqual(9);
    expect(headers.at(0)).toHaveText('Smileys & Emotion');
  });

  describe('onSelect', () => {
    it('calls the provided function with the event and the emoji', () => {
      const onSelectSpy = jest.fn();
      const wrapper = mount(<EmojiSelector onSelect={onSelectSpy}/>);

      const emoji = wrapper.find('.emoji-selector-option').at(0);
      emoji.simulate('mouseDown', {});

      expect(onSelectSpy).toHaveBeenCalledTimes(1);
      expect(onSelectSpy.mock.calls[0][1]).toEqual(String.fromCodePoint(0x1F600));
    });
  });
});
