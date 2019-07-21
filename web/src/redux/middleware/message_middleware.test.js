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

import MessageMiddleware from './message_middleware';
import {clearAlert, showAlert} from '../actions/main_actions';

describe('MessageMiddleware', () => {
  jest.useFakeTimers();

  it('calls next with action if action type not recognised', () => {
    const next = jest.fn();
    const store = {dispatch: jest.fn()};
    const action = showAlert('alert!');

    MessageMiddleware()(store)(next)(action);

    expect(next).toHaveBeenCalledWith(action);
  });

  it('resets the removal countdown if the message updates', () => {
    const next = jest.fn();
    const store = {dispatch: jest.fn()};
    const action = showAlert('alert!');

    const messageMiddleware = MessageMiddleware();

    messageMiddleware(store)(next)(action);

    jest.advanceTimersByTime(2000);

    expect(store.dispatch).not.toHaveBeenCalled();

    messageMiddleware(store)(next)(action);

    jest.advanceTimersByTime(2000);
    expect(store.dispatch).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);
    expect(store.dispatch).toHaveBeenCalledWith(clearAlert());
  });

  describe('SHOW_ALERT', () => {
    it('sets time out to clear alert after a period of time', () => {
      const next = jest.fn();
      const store = {dispatch: jest.fn()};
      const action = showAlert('Alert!');

      const messageMiddleware = MessageMiddleware();
      messageMiddleware(store)(next)(action);

      jest.advanceTimersByTime(2000);
      expect(store.dispatch).not.toHaveBeenCalled();

      jest.advanceTimersByTime(2000);
      expect(store.dispatch).toHaveBeenCalledWith(clearAlert());

      expect(next).toHaveBeenCalledWith(action);
    });
  });

  describe('CLEAR_ALERT', () => {
    it('clears timeout that was set when alert was shown', () => {
      const next = jest.fn();
      const store = {dispatch: jest.fn()};
      const action = showAlert('Alert!');


      const messageMiddleware = MessageMiddleware();
      messageMiddleware(store)(next)(action);

      const clearAction = clearAlert();
      messageMiddleware(store)(next)(clearAction);
      expect(next).toHaveBeenCalledWith(clearAction);
      expect(store.dispatch).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(4000);
      expect(store.dispatch).toHaveBeenCalledTimes(0);
    });
  });
});
