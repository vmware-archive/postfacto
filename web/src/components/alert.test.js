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
import ReactDOM from 'react-dom';
import '../spec_helper';

import Alert from './alert';

describe('Alert', () => {
  let component;

  describe('when message is empty', () => {
    beforeEach(() => {
      ReactDOM.render(<Alert alert={null}/>, root);
    });

    it('should render nothing', () => {
      expect('.alert').toHaveLength(0);
    });
  });

  describe('when message is not empty', () => {
    beforeEach(() => {
      const alert = {
        message: 'Alert Message',
      };
      ReactDOM.render(<Alert alert={alert}/>, root);
    });

    it('should render alert', () => {
      expect('.alert .alert__text').toContainText('Alert Message');
    });

    it('should remove alert after 3.5 seconds by default', () => {
      jest.advanceTimersByTime(3499);
      expect('hideAlert').not.toHaveBeenDispatched();

      jest.advanceTimersByTime(2);
      expect('hideAlert').toHaveBeenDispatched();
    });
  });

  describe('when a duration has been specified', () => {
    beforeEach(() => {
      const alert = {
        message: 'Alert Message',
        duration: 10000,
      };
      ReactDOM.render(<Alert alert={alert}/>, root);
    });

    it('should remove alert after X seconds by default', () => {
      jest.advanceTimersByTime(9999);
      expect('hideAlert').not.toHaveBeenDispatched();

      jest.advanceTimersByTime(2);
      expect('hideAlert').toHaveBeenDispatched();
    });
  });

  describe('when the checkIcon is set to true', () => {
    beforeEach(() => {
      const alert = {
        message: 'Alert Message',
        checkIcon: true,
      };
      ReactDOM.render(<Alert alert={alert}/>, root);
    });

    it('displays the check icon', () => {
      expect('.alert i.fa-check').toHaveLength(1);
    });
  });

  describe('when the checkIcon is set to false', () => {
    beforeEach(() => {
      const alert = {
        message: 'Alert Message',
        checkIcon: false,
      };
      ReactDOM.render(<Alert alert={alert}/>, root);
    });

    it('displays the check icon', () => {
      expect('.alert i.fa-check').toHaveLength(0);
    });
  });

  describe('when component is updated', () => {
    /* eslint-disable react/no-render-return-value */ // There are bigger problems to worry about here
    const renderAlert = (alert) => ReactDOM.render(<Alert alert={alert}/>, root);
    /* eslint-enable react/no-render-return-value */

    beforeEach(() => {
      const alert = {
        message: 'Alert Message',
      };
      component = renderAlert(alert);
    });

    describe('and alert is not null', () => {
      it('should render alert', () => {
        expect('.alert .alert__text').toContainText('Alert Message');
      });

      it('should remove alert after 3.5 seconds by default', () => {
        jest.advanceTimersByTime(3499);
        expect('hideAlert').not.toHaveBeenDispatched();

        jest.advanceTimersByTime(2);
        expect('hideAlert').toHaveBeenDispatched();
      });
    });

    describe('and alert is null', () => {
      it('resets timeout to null', () => {
        expect(component.timeout).toBeDefined();
        renderAlert(null);
        expect(component.timeout).toBeNull();
      });
    });
  });
});
