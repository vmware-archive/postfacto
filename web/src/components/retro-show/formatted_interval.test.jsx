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

import FormattedInterval from './formatted_interval';

describe('FormattedInterval', () => {
  it('renders the given time in M:SS format', () => {
    const dom = shallow(<FormattedInterval secondsRemaining={65}/>);
    expect(dom.find('.formatted-interval')).toIncludeText('1:05');
  });

  it('uses floored seconds', () => {
    const dom = shallow(<FormattedInterval secondsRemaining={65.8}/>);
    expect(dom.find('.formatted-interval')).toIncludeText('1:05');
  });

  it('shows zero correctly', () => {
    const dom = shallow(<FormattedInterval secondsRemaining={0}/>);
    expect(dom.find('.formatted-interval')).toIncludeText('0:00');
  });

  it('shows zero when secondsRemaining is negative', () => {
    const dom = shallow(<FormattedInterval secondsRemaining={-10}/>);
    expect(dom.find('.formatted-interval')).toIncludeText('0:00');
  });
});
