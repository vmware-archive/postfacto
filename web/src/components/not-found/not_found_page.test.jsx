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
import '../../spec_helper';

import {NotFoundPage} from './not_found_page';

describe('NotFoundPage', () => {
  it('displays error details', () => {
    const subject = shallow(<NotFoundPage resetNotFound={jest.fn()} navigateNewRetro={jest.fn()}/>);
    expect(subject.find('h1')).toIncludeText('Oops...');
  });

  it('dispatches redirectToRetroCreatePage when the create retro button is clicked', () => {
    const navigateNewRetro = jest.fn();
    const subject = shallow(<NotFoundPage resetNotFound={jest.fn()} navigateNewRetro={navigateNewRetro}/>);
    const button = subject.find('button');

    expect(button).toIncludeText('Create a Project');
    button.simulate('click');

    expect(navigateNewRetro).toHaveBeenCalled();
  });

  it('dispatches resetNotFound when willUnMount', () => {
    const resetNotFound = jest.fn();
    const subject = mount(<NotFoundPage resetNotFound={resetNotFound} navigateNewRetro={jest.fn()}/>);
    expect(resetNotFound).not.toHaveBeenCalled();
    subject.unmount();
    expect(resetNotFound).toHaveBeenCalled();
  });
});
