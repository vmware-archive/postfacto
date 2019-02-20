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
import '../../spec_helper';

import Alert from './alert';

describe('Alert', () => {
  it('displays a given message', () => {
    const alert = {
      message: 'Alert Message',
    };
    const dom = shallow(<Alert alert={alert}/>);
    expect(dom.find('.alert .alert__text')).toIncludeText('Alert Message');
  });

  it('displays a check icon if requested', () => {
    const alert = {
      message: 'Alert Message',
      checkIcon: true,
    };
    const dom = shallow(<Alert alert={alert}/>);
    expect(dom.find('.alert i.fa-check')).toExist();
  });

  it('displays no check icon if not requested', () => {
    const alert = {
      message: 'Alert Message',
      checkIcon: false,
    };
    const dom = shallow(<Alert alert={alert}/>);
    expect(dom.find('.alert i.fa-check')).not.toExist();
  });

  it('renders nothing when message is empty', () => {
    const dom = shallow(<Alert alert={null}/>);
    expect(dom.find('.alert')).not.toExist();
  });

  it('defaults to displaying no alert', () => {
    const dom = shallow(<Alert/>);
    expect(dom.find('.alert')).not.toExist();
  });
});
