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
import {mount, shallow} from 'enzyme';
import {SpyDispatcher} from '../../spec_helper';

import NotFoundPage from './not_found_page';

describe('NotFoundPage', () => {
  it('displays error details', () => {
    const subject = shallow(<NotFoundPage/>);
    expect(subject.find('h1')).toIncludeText('Oops...');
  });

  it('dispatches redirectToRetroCreatePage when the create retro button is clicked', () => {
    const subject = shallow(<NotFoundPage/>);
    const button = subject.find('button');

    expect(button).toIncludeText('Create a Project');
    button.simulate('click');

    expect(SpyDispatcher).toHaveReceived({type: 'redirectToRetroCreatePage'});
  });

  it('dispatches resetNotFound when willUnMount', () => {
    const subject = mount(<NotFoundPage/>);
    expect(SpyDispatcher).not.toHaveReceived('resetNotFound');
    subject.unmount();
    expect(SpyDispatcher).toHaveReceived('resetNotFound');
  });
});
