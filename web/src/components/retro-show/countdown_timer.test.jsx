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

import CountdownTimer from './countdown_timer';

describe('CountdownTimer', () => {
  let dom;
  let extendTimer;

  beforeEach(() => {
    jest.useFakeTimers();
    global.Date.now = () => 0;
    extendTimer = jest.fn();
  });

  describe('with time remaining', () => {
    beforeEach(() => {
      const FOUR_MINS_FIVE_SECS = 245000;
      dom = mount(<CountdownTimer endTimestampInMs={FOUR_MINS_FIVE_SECS} retroId="retro-slug-123" extendTimer={extendTimer}/>);
    });

    it('displays the remaining time in MM:SS format', () => {
      expect(dom).toIncludeText('4:05');
    });

    it('updates the countdown as time passes', () => {
      global.Date.now = () => 1000;
      jest.advanceTimersByTime(1000);

      expect(dom).toIncludeText('4:04');
    });
  });

  describe('with no time remaining', () => {
    beforeEach(() => {
      dom = mount(<CountdownTimer endTimestampInMs={0} retroId="retro-slug-123" extendTimer={extendTimer}/>);
    });

    it('displays +2 more minutes and no countdown', () => {
      expect(dom.find('.retro-item-timer-extend')).toIncludeText('+2 more minutes');

      expect(dom).not.toIncludeText(':');
      expect(dom.find('.retro-item-timer-clock')).not.toExist();
      expect(dom).toIncludeText('Time\'s Up!');
    });

    it('dispatches extendTimer when extend button clicked', () => {
      dom.find('.retro-item-timer-extend').simulate('click');
      expect(extendTimer).toHaveBeenCalledWith('retro-slug-123');
    });
  });
});
