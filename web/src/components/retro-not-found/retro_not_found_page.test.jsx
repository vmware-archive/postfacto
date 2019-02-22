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
import {Dispatcher} from 'p-flux';
import '../../spec_helper';

import RetroNotFoundPage from './retro_not_found_page';

describe('RetroNotFoundPage', () => {
  let subject;

  beforeEach(() => {
    subject = shallow(<RetroNotFoundPage/>);
  });

  it('displays error details', () => {
    expect(subject.find('h1')).toHaveText('Project not found.');
  });

  it('dispatches redirectToRetroCreatePage when the create retro button is clicked', () => {
    const button = subject.find('button');
    expect(button).toHaveText('Create a Project');
    button.simulate('click');

    expect(Dispatcher).toHaveReceived({type: 'redirectToRetroCreatePage'});
  });

  it('dispatches resetRetroNotFound when unmounting', () => {
    expect(Dispatcher).not.toHaveReceived('resetRetroNotFound');

    subject.unmount();

    expect(Dispatcher).toHaveReceived('resetRetroNotFound');
  });
});
