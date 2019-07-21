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

import PromiseMock from 'promise-mock';
import Grapnel from 'grapnel';
import MockFetch from '../test_support/fetch_matchers';
import apiDispatcher from './api_dispatcher';
import RetroClient from '../api/retro_client';

describe('ApiDispatcher', () => {
  let retro;

  let dispatcher;
  let reduxActions;
  let routerActionDispatcher;
  let analyticsActionDispatcher;

  beforeEach(() => {
    reduxActions = {
      clearErrors: jest.fn(),
      errorsUpdated: jest.fn(),
      currentRetroUpdated: jest.fn(),
      currentRetroItemUpdated: jest.fn(),
      updateWebsocketSession: jest.fn(),
      currentRetroActionItemDeleted: jest.fn(),
      updateFeatureFlags: jest.fn(),
      setNotFound: jest.fn(),
      clearDialog: jest.fn(),
      showDialog: jest.fn(),
      showAlert: jest.fn(),
      clearAlert: jest.fn(),
      updateRetroArchives: jest.fn(),
      updateCurrentArchivedRetro: jest.fn(),
      currentRetroActionItemUpdated: jest.fn(),
      currentRetroSendArchiveEmailUpdated: jest.fn(),
      currentRetroHighlightCleared: jest.fn(),
      currentRetroItemDeleted: jest.fn(),
      currentRetroItemDoneUpdated: jest.fn(),
      forceRelogin: jest.fn(),
    };
    routerActionDispatcher = {
      newRetro: jest.fn(),
      showRetro: jest.fn(),
      home: jest.fn(),
      retroLogin: jest.fn(),
      retroRelogin: jest.fn(),
      showRetroForId: jest.fn(),
      retroArchives: jest.fn(),
      retroArchive: jest.fn(),
      retroSettings: jest.fn(),
      retroPasswordSettings: jest.fn(),
      registration: jest.fn(),
    };
    analyticsActionDispatcher = {
      archivedRetro: jest.fn(),
      createdRetro: jest.fn(),
      createdRetroItem: jest.fn(),
      visitedRetro: jest.fn(),
      doneActionItem: jest.fn(),
      undoneActionItem: jest.fn(),
    };
    const retroClient = new RetroClient(() => 'https://example.com');
    dispatcher = apiDispatcher(retroClient, reduxActions, routerActionDispatcher, analyticsActionDispatcher);
    dispatcher.dispatch = jest.fn();

    retro = {
      id: 1,
      name: 'retro name',
      slug: 'retro-slug-123',
      items: [
        {
          id: 2,
          description: 'happy description',
          vote_count: 1,
          created_at: '2016-01-01T00:00:00.000Z',
        },
        {
          id: 3,
          description: '2nd description',
          vote_count: 3,
          created_at: '2016-01-02T00:00:00.000Z',
        },
        {
          id: 4,
          description: '2nd description',
          vote_count: 2,
          created_at: '2016-01-03T00:00:00.000Z',
        },
      ],
      action_items: [
        {
          id: 1,
          description: 'action item 1',
          done: false,
        },
      ],
    };

    PromiseMock.install();
    MockFetch.install();
  });

  afterEach(() => {
    PromiseMock.uninstall();
    MockFetch.uninstall();
  });

  describe('retroCreate', () => {
    beforeEach(() => {
      localStorage.setItem('authToken', 'the-auth-token');
      dispatcher.retroCreate({
        data: {
          name: 'the retro name',
          slug: 'the-retro-name',
          password: 'the-retro-password',
        },
      });
    });

    it('makes an api POST to /retros, stores the retro, clears errors and navigates to the show retro page', () => {
      expect(MockFetch).toHaveRequested('https://example.com/retros', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'x-auth-token': 'the-auth-token',
        },
        data: {
          retro: {
            name: 'the retro name',
            slug: 'the-retro-name',
            password: 'the-retro-password',
          },
        },
      });
      const request = MockFetch.latestRequest();
      const token = 'the-token';

      request.ok({retro, token});
      Promise.runAll();

      expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual('the-token');

      expect(routerActionDispatcher.showRetro).toHaveBeenCalledWith(retro);
      expect(analyticsActionDispatcher.createdRetro).toHaveBeenCalledWith(retro.id);
      expect(reduxActions.clearErrors).toHaveBeenCalled();
    });

    describe('when unprocessable entity is received', () => {
      beforeEach(() => {
        const request = MockFetch.latestRequest();
        request.resolveJsonStatus(422, {errors: ['some error']});
        Promise.runAll();
      });

      it('dispatches errorsUpdated with the error from the response', () => {
        expect(reduxActions.errorsUpdated).toHaveBeenCalledWith(['some error']);
      });

      it('does not reset API token', () => {
        expect(localStorage.getItem('authToken')).toEqual('the-auth-token');
      });
    });
  });

  describe('updateRetroSettings', () => {
    function dispatchRetroData(new_slug, old_slug, is_private, request_uuid) {
      const data = {
        retro_id: 13,
        retro_name: 'the new retro name',
        new_slug,
        old_slug,
        is_private,
        request_uuid,
      };

      dispatcher.updateRetroSettings({data});
    }

    beforeEach(() => {
      // test appears to be set up badly and requires both retro ID types:
      // (previously responded to all getItem calls with the token)
      localStorage.setItem('apiToken-retro-slug-123', 'the-auth-token');
      localStorage.setItem('apiToken-13', 'the-auth-token');

      dispatcher.router = new Grapnel({pushState: true});
      dispatcher.router.get('/retros/:id', () => {
      });
    });

    it('makes an api PATCH to /retros/:id', () => {
      dispatchRetroData('the-new-slug-123', 'retro-slug-123', true, 'some-uuid');
      expect(MockFetch).toHaveRequested('/retros/13', {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-auth-token',
        },
        data: {
          retro: {
            name: 'the new retro name',
            slug: 'the-new-slug-123',
            is_private: true,
          },
          request_uuid: 'some-uuid',
        },
      });

      const request = MockFetch.latestRequest();
      request.ok({
        retro: {
          is_private: true,
        },
      });
      Promise.runAll();

      const expectedRetro = {
        name: 'the new retro name',
        slug: 'the-new-slug-123',
        is_private: true,
      };
      expect(localStorage.getItem('apiToken-the-new-slug-123')).toEqual('the-auth-token');
      expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual(null);

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(expectedRetro);
      expect(reduxActions.clearErrors).toHaveBeenCalled();
      expect(routerActionDispatcher.showRetro).toHaveBeenCalledWith(expectedRetro);

      expect(reduxActions.showAlert).toHaveBeenCalledWith({
        checkIcon: true,
        message: 'Settings saved!',
        className: 'alert-with-back-button',
      });
    });

    describe('when forbidden is received', () => {
      beforeEach(() => {
        dispatchRetroData('the-new-slug-123', 'retro-slug-123', 'some-uuid');

        const request = MockFetch.latestRequest();
        request.forbidden();
        Promise.runAll();
      });

      it('dispatches requireRetroLogin', () => {
        expect(routerActionDispatcher.retroLogin).toHaveBeenCalledWith(13);
      });

      it('does not reset API token', () => {
        expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual('the-auth-token');
      });
    });

    describe('when unprocessable entity is received', () => {
      beforeEach(() => {
        dispatchRetroData('the-new-slug-123', 'retro-slug-123', 'some-uuid');

        const request = MockFetch.latestRequest();
        request.resolveJsonStatus(422, {errors: ['some error']});
        Promise.runAll();
      });

      it('dispatches retroSettingsUnsuccessfullyUpdated', () => {
        expect(reduxActions.errorsUpdated).toHaveBeenCalledWith(['some error']);
      });

      it('does not reset API token', () => {
        expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual('the-auth-token');
      });
    });

    describe('when slug is not modified and name is changed', () => {
      beforeEach(() => {
        dispatchRetroData('retro-slug-123', 'retro-slug-123', false, 'some-uuid');

        const request = MockFetch.latestRequest();
        request.ok({
          retro: {
            name: 'the new retro name',
            slug: 'retro-slug-123',
            is_private: false,
          },
        });
        Promise.runAll();
      });

      it('dispatches retroSettingsSuccessfullyUpdated', () => {
        const expectedRetro = {
          name: 'the new retro name',
          slug: 'retro-slug-123',
          is_private: false,
        };
        expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(expectedRetro);
        expect(reduxActions.clearErrors).toHaveBeenCalled();
        expect(routerActionDispatcher.showRetro).toHaveBeenCalledWith(expectedRetro);

        expect(reduxActions.showAlert).toHaveBeenCalledWith({
          checkIcon: true,
          message: 'Settings saved!',
          className: 'alert-with-back-button',
        });
      });

      it('does not reset API token', () => {
        expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual('the-auth-token');
      });
    });
  });

  describe('updateRetroPassword', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-13', 'the-auth-token');

      dispatcher.updateRetroPassword({
        data: {
          retro_id: '13',
          current_password: 'current password',
          new_password: 'new password',
          request_uuid: 'some-request-uuid',
        },
      });

      dispatcher.router = new Grapnel({pushState: true});
      dispatcher.router.get('/retros/:id/settings', () => {
      });
    });

    it('makes an api PATCH to /retros/:id/password', () => {
      expect(MockFetch).toHaveRequested('/retros/13/password', {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-auth-token',
        },
        data: {
          current_password: 'current password',
          new_password: 'new password',
          request_uuid: 'some-request-uuid',
        },
      });

      const request = MockFetch.latestRequest();
      request.ok({token: 'new-api-token'});
      Promise.runAll();

      expect(reduxActions.clearErrors).toHaveBeenCalled();
      expect(localStorage.getItem('apiToken-13')).toEqual('new-api-token');

      expect(routerActionDispatcher.retroSettings).toHaveBeenCalledWith('13');

      expect(reduxActions.showAlert).toHaveBeenCalledWith({
        checkIcon: true,
        message: 'Password changed',
      });
    });

    describe('when unprocessable entity is received', () => {
      beforeEach(() => {
        const request = MockFetch.latestRequest();
        request.resolveJsonStatus(422, {errors: ['some error']});
        Promise.runAll();
      });

      it('dispatches retroPasswordUnsuccessfullyUpdated', () => {
        expect(reduxActions.errorsUpdated).toHaveBeenCalledWith(['some error']);
      });
    });
  });

  describe('getRetro', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.getRetro({data: {id: 1}});
    });

    it('makes an api GET to /retros/:id', () => {
      expect(MockFetch).toHaveRequested('/retros/1', {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      const request = MockFetch.latestRequest();
      request.ok({retro});
      Promise.runAll();

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(retro);
      expect(analyticsActionDispatcher.visitedRetro).toHaveBeenCalledWith(1);
    });

    describe('when forbidden is received', () => {
      it('dispatches requireRetroLogin', () => {
        const request = MockFetch.latestRequest();
        request.forbidden();
        Promise.runAll();
        expect(routerActionDispatcher.retroLogin).toHaveBeenCalledWith(1);
      });
    });

    describe('when retro does not exist', () => {
      it('dispatches retroNotFound', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(reduxActions.setNotFound).toHaveBeenCalledWith({retro_not_found: true});
      });
    });
  });

  describe('getRetroLogin', () => {
    beforeEach(() => {
      dispatcher.getRetroLogin({data: {retro_id: 1}});
    });

    it('makes an api GET to /retros/:id/sessions/new', () => {
      expect(MockFetch).toHaveRequested('/retros/1/sessions/new', {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      });
      const request = MockFetch.latestRequest();
      request.ok({retro: {id: 1, name: 'the-fetched-retro-login-name'}});
      Promise.runAll();

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith({
        id: 1,
        name: 'the-fetched-retro-login-name',
      });
    });

    describe('when retro does not exist', () => {
      it('dispatches retroNotFound', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(reduxActions.setNotFound).toHaveBeenCalledWith({retro_not_found: true});
      });
    });
  });

  describe('getRetroSettings', () => {
    const doSetup = () => {
      dispatcher.getRetroSettings({data: {id: 'retro-slug-123'}});
    };

    describe('GET /retros/:id/settings', () => {
      it('returns the retro settings when authenticated', () => {
        localStorage.setItem('apiToken-retro-slug-123', 'the-token');
        doSetup();

        expect(MockFetch).toHaveRequested('/retros/retro-slug-123/settings', {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': 'Bearer the-token',
          },
        });
        const request = MockFetch.latestRequest();
        const response = {retro: {id: 1, name: 'the-fetched-retro-login-name', slug: 'retro-slug-123'}};
        request.ok(response);
        Promise.runAll();

        expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(response.retro);
      });

      it('is forbidden when not authenticated', () => {
        localStorage.setItem('apiToken-retro-slug-123', '');
        doSetup();

        expect(MockFetch).toHaveRequested('/retros/retro-slug-123/settings', {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
          },
        });
        const request = MockFetch.latestRequest();
        request.forbidden();
        Promise.runAll();
        expect(routerActionDispatcher.retroLogin).toHaveBeenCalledWith('retro-slug-123');
      });
    });
  });

  describe('loginToRetro', () => {
    beforeEach(() => {
      dispatcher.loginToRetro({data: {retro_id: 15, password: 'pa55word'}});
    });

    it('makes an api POST to /retros/:id/sessions', () => {
      expect(MockFetch).toHaveRequested('/retros/15/sessions', {
        method: 'POST',
        data: {retro: {password: 'pa55word'}},
      });
      const request = MockFetch.latestRequest();
      request.ok({token: 'the-token'});
      Promise.runAll();
      expect(localStorage.getItem('apiToken-15')).toEqual('the-token');

      expect(routerActionDispatcher.showRetroForId).toHaveBeenCalledWith(15);
    });

    describe('when password is wrong', () => {
      it('dispatches retroLoginFailed', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(reduxActions.errorsUpdated).toHaveBeenCalledWith({login_error_message: 'Oops, wrong password!'});
      });
    });
  });

  describe('deleteRetroItem', () => {
    let item;
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      item = retro.items[0];
      dispatcher.deleteRetroItem({data: {retro_id: 1, item}});
    });
    it('makes an api DELETE to /retros/:id/items/:item_id', () => {
      expect(MockFetch).toHaveRequested('/retros/1/items/2', {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      expect(reduxActions.currentRetroItemDeleted).toHaveBeenCalledWith(item);
    });
  });

  describe('createRetroItem', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.createRetroItem({data: {retro_id: 1, description: 'happy item', category: 'happy'}});
    });

    it('makes an api POST to /retros/:id/items', () => {
      expect(MockFetch).toHaveRequested('/retros/1/items', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {
          description: 'happy item',
          category: 'happy',
        },
      });
    });

    it('dispatches retroItemSuccessfullyCreated with the response', () => {
      const request = MockFetch.latestRequest();
      request.ok({item: {id: 2, category: 'happy', description: 'this is an item'}});
      Promise.runAll();

      expect(reduxActions.currentRetroItemUpdated).toHaveBeenCalledWith({
        id: 2,
        category: 'happy',
        description: 'this is an item',
      });
      expect(analyticsActionDispatcher.createdRetroItem).toHaveBeenCalledWith(1, 'happy');
    });
  });

  describe('updateRetroItem', () => {
    let item;
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      item = retro.items[0];
      dispatcher.updateRetroItem({data: {retro_id: 1, item, description: 'updated description'}});
    });

    it('makes an api PATCH to /retros/:retro_id/items/:id', () => {
      expect(MockFetch).toHaveRequested(`/retros/1/items/${item.id}`, {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {
          description: 'updated description',
        },
      });
    });
  });

  describe('deleteRetroItem', () => {
    let item;
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      item = retro.items[0];
      dispatcher.deleteRetroItem({data: {retro_id: 1, item}});
    });

    it('makes an api DELETE to /retros/:id/items/:item_id', () => {
      expect(MockFetch).toHaveRequested('/retros/1/items/2', {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      expect(reduxActions.currentRetroItemDeleted).toHaveBeenCalledWith(item);
    });
  });

  describe('voteRetroItem', () => {
    let item;
    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.voteRetroItem({data: {retro_id: 1, item}});
    });
    it('makes an api POST to /retros/:id/items/:item_id/vote', () => {
      expect(MockFetch).toHaveRequested('/retros/1/items/2/vote', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      const request = MockFetch.latestRequest();
      request.ok({item});
      Promise.runAll();

      expect(reduxActions.currentRetroItemUpdated).toHaveBeenCalledWith(item);
    });
  });

  describe('nextRetroItem', () => {
    it('makes an API POST to /retros/:id/discussion/transitions', () => {
      localStorage.setItem('apiToken-retro-slug-123', 'the-token');
      retro.highlighted_item_id = 123;
      dispatcher.nextRetroItem({data: {retro}});

      expect(MockFetch).toHaveRequested('/retros/retro-slug-123/discussion/transitions', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {transition: 'NEXT'},
      });

      const request = MockFetch.latestRequest();
      request.ok({retro});
      Promise.runAll();

      expect(reduxActions.currentRetroItemDoneUpdated).toHaveBeenCalledWith(123, true);
    });
  });

  describe('highlightRetroItem', () => {
    let item;
    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.highlightRetroItem({data: {retro_id: 1, item}});
    });
    it('makes an api POST to /retros/:id/discussion', () => {
      expect(MockFetch).toHaveRequested('/retros/1/discussion', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {item_id: 2},
      });

      const request = MockFetch.latestRequest();
      request.ok({retro});
      Promise.runAll();

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(retro);
    });
  });

  describe('unhighlightRetroItem', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.unhighlightRetroItem({data: {retro_id: 1, item_id: 2}});
    });
    it('makes an api DELETE to /retros/:id/discussion', () => {
      expect(MockFetch).toHaveRequested('/retros/1/discussion', {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      expect(reduxActions.currentRetroHighlightCleared).toHaveBeenCalled();
    });
  });

  describe('doneRetroItem', () => {
    let item;
    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.doneRetroItem({data: {retroId: 1, item}});
    });
    it('makes an api PATCH to /retros/:id/items/:item_id/done', () => {
      expect(MockFetch).toHaveRequested('/retros/1/items/2/done', {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      item = retro.items[0];
      item.done = true;
      const request = MockFetch.latestRequest();
      request.ok({item});
      Promise.runAll();

      expect(reduxActions.currentRetroItemDoneUpdated).toHaveBeenCalledWith(item.id, true);
    });
  });

  describe('undoneRetroItem', () => {
    let item;

    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.undoneRetroItem({data: {retroId: 1, item}});
    });

    it('makes an api PATCH to /retros/:id/items/:item_id/done', () => {
      expect(MockFetch).toHaveRequested('/retros/1/items/2/done', {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {
          done: false,
        },
      });

      const request = MockFetch.latestRequest();
      request.noContent();
      Promise.runAll();

      expect(reduxActions.currentRetroItemDoneUpdated).toHaveBeenCalledWith(item.id, false);
    });
  });

  describe('extendTimer', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.extendTimer({data: {retro_id: 1}});
    });

    it('makes an api PATCH to /retros/:id/discussion', () => {
      expect(MockFetch).toHaveRequested('/retros/1/discussion', {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      const request = MockFetch.latestRequest();
      request.ok({retro});
      Promise.runAll();

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(retro);
    });
  });

  describe('archiveRetro', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.archiveRetro({data: {retro: {slug: 1, send_archive_email: true}}});
    });

    it('makes an api PUT to /retros/:id/archive', () => {
      expect(MockFetch).toHaveRequested('/retros/1/archive', {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {
          send_archive_email: true,
        },
      });

      const request = MockFetch.latestRequest();
      request.ok({retro});
      Promise.runAll();

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(retro);
      expect(analyticsActionDispatcher.archivedRetro).toHaveBeenCalledWith(retro.id);
      expect(reduxActions.showAlert).toHaveBeenCalledWith({message: 'Archived!'});
    });
  });

  describe('createRetroActionItem', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.createRetroActionItem({data: {retro_id: 1, description: 'a new action item'}});
    });

    it('makes an api POST to /retros/:id/action_items', () => {
      expect(MockFetch).toHaveRequested('/retros/1/action_items', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {
          description: 'a new action item',
        },
      });
    });
  });

  describe('doneRetroActionItem', () => {
    let action_item;

    beforeEach(() => {
      action_item = retro.action_items[0];
      localStorage.setItem('apiToken-1', 'the-token');
    });

    it('makes an api PATCH to /retros/:id/action_items/:action_item_id and updates store', () => {
      dispatcher.doneRetroActionItem({data: {retro_id: 1, action_item_id: 1, done: true}});

      expect(MockFetch).toHaveRequested('/retros/1/action_items/1', {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {
          done: true,
        },
      });

      const request = MockFetch.latestRequest();
      request.ok({action_item});
      Promise.runAll();

      expect(reduxActions.currentRetroActionItemUpdated).toHaveBeenCalledWith(action_item);
    });

    it('calls done item analytics call when item is done', () => {
      action_item.done = true;

      dispatcher.doneRetroActionItem({data: {retro_id: 1, action_item_id: 1, done: true}});

      const request = MockFetch.latestRequest();
      request.ok({action_item});
      Promise.runAll();

      expect(reduxActions.currentRetroActionItemUpdated).toHaveBeenCalledWith(action_item);
      expect(analyticsActionDispatcher.doneActionItem).toHaveBeenCalledWith(1);
    });

    it('calls undone item analytics call when item is not done', () => {
      dispatcher.doneRetroActionItem({data: {retro_id: 1, action_item_id: 1, done: true}});

      const request = MockFetch.latestRequest();
      request.ok({action_item});
      Promise.runAll();

      expect(reduxActions.currentRetroActionItemUpdated).toHaveBeenCalledWith(action_item);
      expect(analyticsActionDispatcher.undoneActionItem).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteRetroActionItem', () => {
    let action_item;
    beforeEach(() => {
      action_item = retro.action_items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.deleteRetroActionItem({data: {retro_id: 1, action_item}});
    });

    it('makes an api DELETE to /retros/:id/action_items/:action_item_id', () => {
      expect(MockFetch).toHaveRequested('/retros/1/action_items/1', {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      expect(reduxActions.currentRetroActionItemDeleted).toHaveBeenCalledWith(action_item);
    });
  });

  describe('editRetroActionItem', () => {
    let action_item;
    beforeEach(() => {
      action_item = retro.action_items[0];
      localStorage.setItem('apiToken-1', 'the-token');

      dispatcher.editRetroActionItem({
        data: {retro_id: 1, action_item_id: action_item.id, description: 'this is a description'},
      });
    });

    it('makes an api PUT to /retros/:id/action_items/:action_item_id', () => {
      expect(MockFetch).toHaveRequested('/retros/1/action_items/1', {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      const request = MockFetch.latestRequest();
      request.ok({action_item});
      Promise.runAll();

      expect(reduxActions.currentRetroActionItemUpdated).toHaveBeenCalledWith(action_item);
    });
  });

  describe('getRetroArchives', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.getRetroArchives({data: {retro_id: '1'}});
    });

    it('makes an api GET to /retros/:retro_id/archives', () => {
      expect(MockFetch).toHaveRequested('/retros/1/archives', {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      const request = MockFetch.latestRequest();
      const archives = [{id: 4}, {id: 5}];
      request.ok({archives});
      Promise.runAll();

      expect(reduxActions.updateRetroArchives).toHaveBeenCalledWith(archives);
    });

    describe('when retro does not exist', () => {
      it('dispatches retroNotFound', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(reduxActions.setNotFound).toHaveBeenCalledWith({retro_not_found: true});
      });
    });
  });

  describe('getRetroArchive', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      dispatcher.getRetroArchive({data: {retro_id: '1', archive_id: '1'}});
    });

    it('makes an api GET to /retros/:retro_id/archives/:archive_id', () => {
      expect(MockFetch).toHaveRequested('/retros/1/archives/1', {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      const request = MockFetch.latestRequest();
      request.ok({retro, archive: {id: 6}});
      Promise.runAll();

      expect(reduxActions.updateCurrentArchivedRetro).toHaveBeenCalledWith(retro);
    });

    describe('when archives do not exist', () => {
      it('dispatches notFound', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(reduxActions.setNotFound).toHaveBeenCalledWith({not_found: true});
      });
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      dispatcher.createUser({
        data: {access_token: 'the-access-token', company_name: 'Company name', full_name: 'My Full Name'},
      });
    });

    it('makes an api POST to /users', () => {
      expect(MockFetch).toHaveRequested('/users', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        data: {
          'access_token': 'the-access-token',
          'company_name': 'Company name',
          'full_name': 'My Full Name',
        },
      });
      const request = MockFetch.latestRequest();
      request.ok();
      Promise.runAll();

      expect(routerActionDispatcher.newRetro).toHaveBeenCalled();
    });

    it('stores the auth token in local storage', () => {
      const request = MockFetch.latestRequest();
      request.ok({auth_token: 'the-token'});
      Promise.runAll();

      expect(localStorage.getItem('authToken')).toEqual('the-token');
    });
  });

  describe('createSession', () => {
    beforeEach(() => {
      dispatcher.createSession({
        data: {access_token: 'the-access-token', email: 'a@a.a', name: 'My full name'},
      });
    });

    it('makes an api POST to /sessions and stores token in local storage', () => {
      expect(MockFetch).toHaveRequested('/sessions', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        data: {
          'access_token': 'the-access-token',
        },
      });
      const request = MockFetch.latestRequest();
      request.ok({auth_token: 'auth-token'});
      Promise.runAll();

      expect(localStorage.getItem('authToken')).toEqual('auth-token');
    });

    it('redirects new user to new retro', () => {
      const request = MockFetch.latestRequest();
      request.ok({new_user: true});
      Promise.runAll();

      expect(routerActionDispatcher.newRetro).toHaveBeenCalled();
    });

    it('redirects existing user to home', () => {
      const request = MockFetch.latestRequest();
      request.ok({new_user: false});
      Promise.runAll();

      expect(routerActionDispatcher.home).toHaveBeenCalled();
    });

    it('if the server returns a 404 because the user does not exist', () => {
      const request = MockFetch.latestRequest();
      request.notFound();
      Promise.runAll();

      expect(routerActionDispatcher.registration).toHaveBeenCalledWith('the-access-token', 'a@a.a', 'My full name');
    });

    it('stores the auth token in local storage', () => {
      const request = MockFetch.latestRequest();
      request.ok({auth_token: 'the-token'});
      Promise.runAll();

      expect(localStorage.getItem('authToken')).toEqual('the-token');
    });
  });

  describe('retrieveConfig', () => {
    beforeEach(() => {
      dispatcher.retrieveConfig({data: undefined});
    });

    it('makes an api GET to /config', () => {
      expect(MockFetch).toHaveRequested('/config', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      });
      const request = MockFetch.latestRequest();
      request.ok({archive_emails: true});
      Promise.runAll();

      expect(reduxActions.updateFeatureFlags).toHaveBeenCalledWith({
        archiveEmails: true,
      });
    });

    it('sets not found when config not found', () => {
      expect(MockFetch).toHaveRequested('/config', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      });
      const request = MockFetch.latestRequest();
      request.notFound();
      Promise.runAll();

      expect(reduxActions.setNotFound).toHaveBeenCalledWith({
        not_found: true,
      });
    });
  });
});
