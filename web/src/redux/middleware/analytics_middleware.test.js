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

import AnalyticsMiddleware from './analytics_middleware';

describe('AnalyticsMiddleware', () => {
  beforeEach(() => {
  });

  it('calls next with action if action type not recognised', () => {
    const action = {
      type: 'OTHER',
    };

    const next = jest.fn();
    const store = {dispatch: jest.fn()};
    const analyticsClient = {track: jest.fn()};
    AnalyticsMiddleware(analyticsClient)(store)(next)(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(analyticsClient.track).not.toHaveBeenCalled();
  });

  it('Passes TRACK_ANALYTICS payload to analyticsClient.track and stops event propagating', () => {
    const analyticsInfo = {type: 'Created Retro', data: {'retroId': 1}};
    const doneAction = {
      type: 'TRACK_ANALYTICS',
      payload: analyticsInfo,
    };

    const next = jest.fn();
    const analyticsClient = {track: jest.fn()};
    AnalyticsMiddleware(analyticsClient)({})(next)(doneAction);

    expect(analyticsClient.track).toHaveBeenCalledWith('Created Retro', {retroId: 1});
    expect(next).not.toHaveBeenCalled();
  });
});
