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

import CountdownTimer from './countdown_timer';
import ReactDOM from 'react-dom';
import '../spec_helper';

describe('CountdownTimer', () => {
  beforeEach(() => {
    global.Date.now = () => 0;
  });

  describe('when end time in the future', () => {
    beforeEach(() => {
      let FOUR_MINS_FIVE_SECS = 245000;
      ReactDOM.render(<CountdownTimer endTimestampInMs={FOUR_MINS_FIVE_SECS} retroId="retro-slug-123"/>, root);
    });

    it('renders a formatted time component', () => {
      expect('.retro-item-timer-clock .formatted-interval').toExist();
      expect('.retro-item-timer-clock .formatted-interval').toHaveText('4:05');
    });

    it('updates remaining time when time ticks', () => {
      global.Date.now = () => 1000;
      jest.advanceTimersByTime(1000);

      expect('.retro-item-timer-clock .formatted-interval').toHaveText('4:04');
    });
  });

  describe('when end time in the past', () => {
    beforeEach(() => {
      ReactDOM.render(<CountdownTimer endTimestampInMs={0} retroId="retro-slug-123"/>, root);
    });

    it('displays +2 more minutes and Time\'s Up!', () => {
      expect('.retro-item-timer-extend').toHaveText('Time\'s Up!+2 more minutes');
      expect($('.retro-item-timer-clock').length).toEqual(0);
    });

    describe('when clicking on extend Timer', () => {
      it('adds 2 more minutes to endTime', () => {
        $('.retro-item-timer-extend').simulate('click');
        expect('extendTimer').toHaveBeenDispatchedWith({type: 'extendTimer', data: {retro_id: 'retro-slug-123'}});
      });
    });
  });
});
