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

import FormattedInterval from './formatted_interval';
import ReactDOM from 'react-dom';
import '../spec_helper';

describe('FormattedInterval', () => {
  it('should render the time remaining', () => {
    ReactDOM.render(<FormattedInterval secondsRemaining={65} />, root);
    expect('.formatted-interval').toHaveText('1:05');
  });

  it('uses rounded seconds', () => {
    ReactDOM.render(<FormattedInterval secondsRemaining={65.2}/>, root);
    expect('.formatted-interval').toHaveText('1:05');
  });

  it('shows zero correctly', () => {
    ReactDOM.render(<FormattedInterval secondsRemaining={0} />, root);
    expect('.formatted-interval').toHaveText('0:00');
  });

  it('shows zero when secondsRemaining is negative', () => {
      ReactDOM.render(<FormattedInterval secondsRemaining={-10} />, root);
      expect('.formatted-interval').toHaveText('0:00');
  });
});