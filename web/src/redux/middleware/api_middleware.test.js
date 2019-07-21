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
import MockFetch from '../../test_support/fetch_matchers';
import RetroClient from '../../api/retro_client';

import ApiMiddleware from './api_middleware';
import {
  archiveRetro, createRetroActionItem,
  createRetroItem, createSession, createUser, deleteRetroActionItem,
  deleteRetroItem, doneRetroActionItem, doneRetroItem, editRetroActionItem, extendTimer,
  getRetro, getRetroArchive, getRetroArchives,
  getRetroLogin,
  getRetroSettings, highlightRetroItem, loginToRetro, nextRetroItem, retrieveConfig,
  retroCreate, undoneRetroItem, unhighlightRetroItem, updateRetroItem,
  updateRetroPassword,
  updateRetroSettings, voteRetroItem,
} from '../actions/api_actions';
import {
  clearErrors,
  currentRetroActionItemDeleted,
  currentRetroActionItemUpdated,
  currentRetroHighlightCleared, currentRetroItemDeleted,
  currentRetroItemDoneUpdated, currentRetroItemUpdated,
  currentRetroUpdated,
  errorsUpdated, getRetros, retrosUpdated,
  setNotFound,
  showAlert, signOut,
  updateCurrentArchivedRetro,
  updateFeatureFlags,
  updateRetroArchives,
} from '../actions/main_actions';
import {
  archivedRetro,
  createdRetro,
  createdRetroItem,
  doneActionItem,
  undoneActionItem, visitedRetro,
} from '../actions/analytics_actions';
import {
  home,
  newRetro,
  registration,
  retroLogin,
  retroSettings,
  showRetro,
  showRetroForId,
} from '../actions/router_actions';


describe('ApiMiddleware', () => {
  let retro;
  let middleware;
  let store;
  let next;

  beforeEach(() => {
    const retroClient = new RetroClient(() => 'https://example.com');
    middleware = ApiMiddleware(retroClient);
    store = {dispatch: jest.fn()};
    next = jest.fn();

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


  it('calls next with action if action type not recognised', () => {
    const action = {
      type: 'OTHER',
    };

    middleware(store)(next)(action);

    expect(next).toHaveBeenCalledWith(action);
  });

  describe('RETRO_CREATE', () => {
    beforeEach(() => {
      localStorage.setItem('authToken', 'the-auth-token');
      middleware(store)(next)(retroCreate({
        name: 'the retro name',
        slug: 'the-retro-name',
        password: 'the-retro-password',
      }));
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


      expect(store.dispatch).toHaveBeenCalledWith(clearErrors());
      expect(store.dispatch).toHaveBeenCalledWith(showRetro(retro));
      expect(store.dispatch).toHaveBeenCalledWith(createdRetro(retro.id));
    });

    describe('when unprocessable entity is received', () => {
      beforeEach(() => {
        const request = MockFetch.latestRequest();
        request.resolveJsonStatus(422, {errors: ['some error']});
        Promise.runAll();
      });

      it('dispatches errorsUpdated with the error from the response', () => {
        expect(store.dispatch).toHaveBeenCalledWith(errorsUpdated(['some error']));
      });

      it('does not reset API token', () => {
        expect(localStorage.getItem('authToken')).toEqual('the-auth-token');
      });
    });
  });

  describe('UPDATE_RETRO_SETTINGS', () => {
    function dispatchRetroData(new_slug, old_slug, is_private, request_uuid) {
      middleware(store)(next)(updateRetroSettings(13, 'the new retro name', new_slug, old_slug, is_private, request_uuid, 'http://www.example.com'));
    }

    beforeEach(() => {
      // test appears to be set up badly and requires both retro ID types:
      // (previously responded to all getItem calls with the token)
      localStorage.setItem('apiToken-retro-slug-123', 'the-auth-token');
      localStorage.setItem('apiToken-13', 'the-auth-token');
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
            video_link: 'http://www.example.com',
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroUpdated(expectedRetro));
      expect(store.dispatch).toHaveBeenCalledWith(clearErrors());
      expect(store.dispatch).toHaveBeenCalledWith(showRetro(expectedRetro));
      expect(store.dispatch).toHaveBeenCalledWith(showAlert({
        checkIcon: true,
        message: 'Settings saved!',
        className: 'alert-with-back-button',
      }));
    });

    describe('when forbidden is received', () => {
      beforeEach(() => {
        dispatchRetroData('the-new-slug-123', 'retro-slug-123', 'some-uuid');

        const request = MockFetch.latestRequest();
        request.forbidden();
        Promise.runAll();
      });

      it('dispatches requireRetroLogin', () => {
        expect(store.dispatch).toHaveBeenCalledWith(retroLogin(13));
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
        expect(store.dispatch).toHaveBeenCalledWith(errorsUpdated(['some error']));
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
        expect(store.dispatch).toHaveBeenCalledWith(currentRetroUpdated(expectedRetro));
        expect(store.dispatch).toHaveBeenCalledWith(clearErrors());
        expect(store.dispatch).toHaveBeenCalledWith(showRetro(expectedRetro));
        expect(store.dispatch).toHaveBeenCalledWith(showAlert({
          checkIcon: true,
          message: 'Settings saved!',
          className: 'alert-with-back-button',
        }));
      });

      it('does not reset API token', () => {
        expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual('the-auth-token');
      });
    });
  });

  describe('UPDATE_RETRO_PASSWORD', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-13', 'the-auth-token');

      const action = updateRetroPassword('13', 'current password', 'new password', 'some-request-uuid');
      middleware(store)(next)(action);
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

      expect(localStorage.getItem('apiToken-13')).toEqual('new-api-token');
      expect(store.dispatch).toHaveBeenCalledWith(clearErrors());
      expect(store.dispatch).toHaveBeenCalledWith(retroSettings('13'));
      expect(store.dispatch).toHaveBeenCalledWith(showAlert({
        checkIcon: true,
        message: 'Password changed',
      }));
    });

    describe('when unprocessable entity is received', () => {
      beforeEach(() => {
        const request = MockFetch.latestRequest();
        request.resolveJsonStatus(422, {errors: ['some error']});
        Promise.runAll();
      });

      it('dispatches retroPasswordUnsuccessfullyUpdated', () => {
        expect(store.dispatch).toHaveBeenCalledWith(errorsUpdated(['some error']));
      });
    });
  });

  describe('GET_RETROS', () => {
    beforeEach(() => {
      localStorage.setItem('authToken', 'the-auth-token');
      const action = getRetros();
      middleware(store)(next)(action);
    });

    it('makes an API GET to /retros', () => {
      expect(MockFetch).toHaveRequested('/retros', {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'x-auth-token': 'the-auth-token',
        },
      });

      const retros = [{id: 1}];

      const request = MockFetch.latestRequest();
      request.ok({retros});

      Promise.runAll();
      expect(store.dispatch).toHaveBeenCalledWith(retrosUpdated(retros));
    });

    describe('when forbidden is received', () => {
      it('dispatches signOut', () => {
        const request = MockFetch.latestRequest();
        request.forbidden();
        Promise.runAll();
        expect(store.dispatch).toHaveBeenCalledWith(signOut());
      });
    });
  });

  describe('GET_RETRO', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(getRetro(1));
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroUpdated(retro));
      expect(store.dispatch).toHaveBeenCalledWith(visitedRetro(1));
    });

    describe('when forbidden is received', () => {
      it('dispatches requireRetroLogin', () => {
        const request = MockFetch.latestRequest();
        request.forbidden();
        Promise.runAll();
        expect(store.dispatch).toHaveBeenCalledWith(retroLogin(1));
      });
    });

    describe('when retro does not exist', () => {
      it('dispatches retroNotFound', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(store.dispatch).toHaveBeenCalledWith(setNotFound({retro_not_found: true}));
      });
    });
  });

  describe('getRetroLogin', () => {
    beforeEach(() => {
      middleware(store)(next)(getRetroLogin(1));
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroUpdated({
        id: 1,
        name: 'the-fetched-retro-login-name',
      }));
    });

    describe('when retro does not exist', () => {
      it('dispatches retroNotFound', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(store.dispatch).toHaveBeenCalledWith(setNotFound({retro_not_found: true}));
      });
    });
  });

  describe('getRetroSettings', () => {
    const doSetup = () => {
      middleware(store)(next)(getRetroSettings('retro-slug-123'));
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

        expect(store.dispatch).toHaveBeenCalledWith(currentRetroUpdated(response.retro));
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
        expect(store.dispatch).toHaveBeenCalledWith(retroLogin('retro-slug-123'));
      });
    });
  });

  describe('loginToRetro', () => {
    beforeEach(() => {
      middleware(store)(next)(loginToRetro(15, 'pa55word'));
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

      expect(store.dispatch).toHaveBeenCalledWith(showRetroForId(15));
    });

    describe('when password is wrong', () => {
      it('dispatches retroLoginFailed', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(store.dispatch).toHaveBeenCalledWith(errorsUpdated({login_error_message: 'Oops, wrong password!'}));
      });
    });
  });

  describe('deleteRetroItem', () => {
    let item;
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      item = retro.items[0];
      middleware(store)(next)(deleteRetroItem(1, item));
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
      expect(store.dispatch).toHaveBeenCalledWith(currentRetroItemDeleted(item));
    });
  });

  describe('createRetroItem', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      const action = createRetroItem(1, 'happy', 'happy item');
      middleware(store)(next)(action);
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroItemUpdated({
        id: 2,
        category: 'happy',
        description: 'this is an item',
      }));
      expect(store.dispatch).toHaveBeenCalledWith(createdRetroItem(1, 'happy'));
    });
  });

  describe('updateRetroItem', () => {
    let item;
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      item = retro.items[0];
      middleware(store)(next)(updateRetroItem(1, item, 'updated description'));
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

  describe('voteRetroItem', () => {
    let item;
    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(voteRetroItem(1, item));
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroItemUpdated(item));
    });
  });

  describe('nextRetroItem', () => {
    it('makes an API POST to /retros/:id/discussion/transitions', () => {
      localStorage.setItem('apiToken-retro-slug-123', 'the-token');
      retro.highlighted_item_id = 123;
      middleware(store)(next)(nextRetroItem(retro));

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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroItemDoneUpdated(123, true));
    });
  });

  describe('highlightRetroItem', () => {
    let item;
    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(highlightRetroItem(1, item));
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroUpdated(retro));
    });
  });

  describe('unhighlightRetroItem', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(unhighlightRetroItem(1));
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroHighlightCleared());
    });
  });

  describe('doneRetroItem', () => {
    let item;
    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(doneRetroItem(1, item));
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroItemDoneUpdated(item.id, true));
    });
  });

  describe('undoneRetroItem', () => {
    let item;

    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(undoneRetroItem(1, item));
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroItemDoneUpdated(item.id, false));
    });
  });

  describe('extendTimer', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(extendTimer(1));
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroUpdated(retro));
    });
  });

  describe('archiveRetro', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      const action = archiveRetro({slug: 1, send_archive_email: true});
      middleware(store)(next)(action);
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroUpdated(retro));
      expect(store.dispatch).toHaveBeenCalledWith(archivedRetro(retro.id));
      expect(store.dispatch).toHaveBeenCalledWith(showAlert({message: 'Archived!'}));
    });
  });

  describe('createRetroActionItem', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(createRetroActionItem(1, 'a new action item'));
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
      const action = doneRetroActionItem(1, 1, true);
      middleware(store)(next)(action);

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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroActionItemUpdated(action_item));
    });

    it('calls done item analytics call when item is done', () => {
      action_item.done = true;

      const action = doneRetroActionItem(1, 1, true);
      middleware(store)(next)(action);

      const request = MockFetch.latestRequest();
      request.ok({action_item});
      Promise.runAll();

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroActionItemUpdated(action_item));
      expect(store.dispatch).toHaveBeenCalledWith(doneActionItem(1));
    });

    it('calls undone item analytics call when item is not done', () => {
      const action = doneRetroActionItem(1, 1, true);
      middleware(store)(next)(action);

      const request = MockFetch.latestRequest();
      request.ok({action_item});
      Promise.runAll();

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroActionItemUpdated(action_item));
      expect(store.dispatch).toHaveBeenCalledWith(undoneActionItem(1));
    });
  });

  describe('deleteRetroActionItem', () => {
    let action_item;
    beforeEach(() => {
      action_item = retro.action_items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(deleteRetroActionItem(1, action_item));
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroActionItemDeleted(action_item));
    });
  });

  describe('editRetroActionItem', () => {
    let action_item;
    beforeEach(() => {
      action_item = retro.action_items[0];
      localStorage.setItem('apiToken-1', 'the-token');

      const action = editRetroActionItem(1, action_item.id, 'this is a description');
      middleware(store)(next)(action);
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

      expect(store.dispatch).toHaveBeenCalledWith(currentRetroActionItemUpdated(action_item));
    });
  });

  describe('getRetroArchives', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(getRetroArchives('1'));
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

      expect(store.dispatch).toHaveBeenCalledWith(updateRetroArchives(archives));
    });

    describe('when retro does not exist', () => {
      it('dispatches retroNotFound', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(store.dispatch).toHaveBeenCalledWith(setNotFound({retro_not_found: true}));
      });
    });
  });

  describe('getRetroArchive', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      middleware(store)(next)(getRetroArchive('1', '1'));
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

      expect(store.dispatch).toHaveBeenCalledWith(updateCurrentArchivedRetro(retro));
    });

    describe('when archives do not exist', () => {
      it('dispatches notFound', () => {
        const request = MockFetch.latestRequest();
        request.notFound();
        Promise.runAll();
        expect(store.dispatch).toHaveBeenCalledWith(setNotFound({not_found: true}));
      });
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      const action = createUser('the-access-token', 'Company name', 'My Full Name');
      middleware(store)(next)(action);
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

      expect(store.dispatch).toHaveBeenCalledWith(newRetro());
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
      const action = createSession('the-access-token', 'a@a.a', 'My full name');
      middleware(store)(next)(action);
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

      expect(store.dispatch).toHaveBeenCalledWith(newRetro());
    });

    it('redirects existing user to home', () => {
      const request = MockFetch.latestRequest();
      request.ok({new_user: false});
      Promise.runAll();

      expect(store.dispatch).toHaveBeenCalledWith(home());
    });

    it('if the server returns a 404 because the user does not exist', () => {
      const request = MockFetch.latestRequest();
      request.notFound();
      Promise.runAll();

      expect(store.dispatch).toHaveBeenCalledWith(registration('the-access-token', 'a@a.a', 'My full name'));
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
      middleware(store)(next)(retrieveConfig());
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

      expect(store.dispatch).toHaveBeenCalledWith(updateFeatureFlags({
        archiveEmails: true,
      }));
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

      expect(store.dispatch).toHaveBeenCalledWith(setNotFound({
        not_found: true,
      }));
    });
  });
});
