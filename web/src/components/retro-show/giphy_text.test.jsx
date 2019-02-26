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
import GiphyText from './giphy_text';

import '../../spec_helper';

describe('GiphyText', () => {
  it('interpolates gifs in place of giphy keywords', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValue({
      status: 200,
      json: () => ({
        url: 'http://example.com/gif',
      }),
    });

    const value = 'example /giphy search';
    const wrapper = mount(<GiphyText retroId="testing" value={value}/>);
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.text()).toEqual('example ');

    const img = wrapper.find('img');

    expect(img.prop('src')).toEqual('http://example.com/gif');
    expect(img.prop('alt')).toEqual('search');
  });

  it('retains giphy keywords on error', async () => {
    jest.spyOn(window, 'fetch').mockRejectedValue(new Error('does not work'));

    const value = 'example /giphy search';
    const wrapper = mount(<GiphyText retroId="testing" value={value}/>);
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.text()).toEqual(value);
  });
});
