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

import {SpyDispatcher} from '../spec_helper';
import '../test_support/fetch_matchers';
import PromiseMock from 'promise-mock';
import Cursor from 'pui-cursor';
import Grapnel from 'grapnel';

describe('ApiDispatcher', () => {
  let subject;
  let cursorSpy;
  let retro;
  let realDispatchLevels;

  beforeEach(() => {
    PromiseMock.install();

    Cursor.async = false;
    cursorSpy = jasmine.createSpy('callback');
    subject = SpyDispatcher;

    // dispatch is spied on in spec_helper
    let dispatchCount = 0;
    realDispatchLevels = 1;
    subject.dispatch.and.callFake((action) => {
      dispatchCount++;
      if (dispatchCount <= realDispatchLevels) {
        // Call through for first (potentially several) dispatches ONLY
        // Later dispatches are recorded but not invoked
        subject.nonFakeDispatch(action);
      }
    });

    // prevent console logs
    spyOn(subject, 'onDispatch');
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

    jasmine.Ajax.install();
  });

  afterEach(() => {
    PromiseMock.uninstall();
    jasmine.Ajax.uninstall();
  });

  describe('retroCreate', () => {
    beforeEach(() => {
      localStorage.setItem('authToken', 'the-auth-token');
      subject.dispatch({
        type: 'retroCreate',
        data: {
          name: 'the retro name',
          slug: 'the-retro-name',
          password: 'the-retro-password',
        },
      });
    });

    it('makes an api POST to /retros', () => {
      expect('https://example.com/retros').toHaveBeenRequestedWith({
        method: 'POST',
        requestHeaders: {
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
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({retro: retro, token: 'the-token'});
      Promise.runAll();
      expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual('the-token');
      expect('retroSuccessfullyCreated').toHaveBeenDispatched();
    });

    describe('when unprocessable entity is received', () => {
      beforeEach(() => {
        const request = jasmine.Ajax.requests.mostRecent();
        request.respondWith({status: 422, contentType: 'application/json', responseText: '{"errors": ["some error"]}'});
        Promise.runAll();
      });

      it('dispatches retroUnsuccessfullyCreated', () => {
        expect('retroUnsuccessfullyCreated').toHaveBeenDispatchedWith({
          type: 'retroUnsuccessfullyCreated',
          data: {errors: ['some error']},
        });
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
        new_slug: new_slug,
        old_slug: old_slug,
        is_private: is_private,
        request_uuid: request_uuid,
      };

      subject.dispatch({type: 'updateRetroSettings', data: data});
    }

    beforeEach(() => {
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      // test appears to be set up badly and requires both retro ID types:
      // (previously responded to all getItem calls with the token)
      localStorage.setItem('apiToken-retro-slug-123', 'the-auth-token');
      localStorage.setItem('apiToken-13', 'the-auth-token');

      subject.router = new Grapnel({pushState: true});
      subject.router.get('/retros/:id', () => {});
    });

    it('makes an api PATCH to /retros/:id', () => {
      dispatchRetroData('the-new-slug-123', 'retro-slug-123', true, 'some-uuid');
      expect('/retros/13').toHaveBeenRequestedWith({
        method: 'PATCH',
        requestHeaders: {
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

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({
        retro: {
          name: 'the new retro name',
          slug: 'the-new-slug-123',
          is_private: true,
        },
      });
      Promise.runAll();
      expect('retroSettingsSuccessfullyUpdated').toHaveBeenDispatchedWith({
        type: 'retroSettingsSuccessfullyUpdated',
        data: {
          retro: {
            name: 'the new retro name',
            slug: 'the-new-slug-123',
            is_private: true,
          },
        },
      });

      expect(localStorage.getItem('apiToken-the-new-slug-123')).toEqual('the-auth-token');
      expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual(null);

      expect('showAlert').toHaveBeenDispatchedWith({
        type: 'showAlert',
        data: {
          checkIcon: true,
          message: 'Settings saved!',
          className: 'alert-with-back-button',
        },
      });
    });

    describe('when forbidden is received', () => {
      beforeEach(() => {
        dispatchRetroData('the-new-slug-123', 'retro-slug-123', 'some-uuid');

        const request = jasmine.Ajax.requests.mostRecent();
        request.forbidden();
        Promise.runAll();
      });

      it('dispatches requireRetroLogin', () => {
        expect('requireRetroLogin').toHaveBeenDispatchedWith({
          type: 'requireRetroLogin',
          data: {retro_id: 13},
        });
      });

      it('does not reset API token', () => {
        expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual('the-auth-token');
      });
    });

    describe('when unprocessable entity is received', () => {
      beforeEach(() => {
        dispatchRetroData('the-new-slug-123', 'retro-slug-123', 'some-uuid');

        const request = jasmine.Ajax.requests.mostRecent();
        request.respondWith({status: 422, contentType: 'application/json', responseText: '{"errors": ["some error"]}'});
        Promise.runAll();
      });

      it('dispatches retroSettingsUnsuccessfullyUpdated', () => {
        expect('retroSettingsUnsuccessfullyUpdated').toHaveBeenDispatchedWith({
          type: 'retroSettingsUnsuccessfullyUpdated',
          data: {errors: ['some error']},
        });
      });

      it('does not reset API token', () => {
        expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual('the-auth-token');
      });
    });

    describe('when slug is not modified and name is changed', () => {
      beforeEach(() => {
        dispatchRetroData('retro-slug-123', 'retro-slug-123', false, 'some-uuid');

        const request = jasmine.Ajax.requests.mostRecent();
        request.succeed({
          retro: {
            name: 'the new retro name',
            slug: 'retro-slug-123',
            is_private: false,
          },
        });
        Promise.runAll();
      });

      it('dispatches retroSettingsSuccessfullyUpdated', () => {
        expect('retroSettingsSuccessfullyUpdated').toHaveBeenDispatchedWith({
          type: 'retroSettingsSuccessfullyUpdated',
          data: {
            retro: {
              name: 'the new retro name',
              slug: 'retro-slug-123',
              is_private: false,
            },
          },
        });
      });

      it('does not reset API token', () => {
        expect(localStorage.getItem('apiToken-retro-slug-123')).toEqual('the-auth-token');
      });
    });
  });

  describe('updateRetroPassword', () => {
    beforeEach(() => {
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      localStorage.setItem('apiToken-13', 'the-auth-token');

      subject.dispatch({
        type: 'updateRetroPassword',
        data: {
          retro_id: '13',
          current_password: 'current password',
          new_password: 'new password',
          request_uuid: 'some-request-uuid',
        },
      });

      subject.router = new Grapnel({pushState: true});
      subject.router.get('/retros/:id/settings', () => {});
    });

    it('makes an api PATCH to /retros/:id/password', () => {
      expect('/retros/13/password').toHaveBeenRequestedWith({
        method: 'PATCH',
        requestHeaders: {
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

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({token: 'new-api-token'});
      Promise.runAll();
      expect('retroPasswordSuccessfullyUpdated').toHaveBeenDispatchedWith({
        type: 'retroPasswordSuccessfullyUpdated',
        data: {
          retro_id: '13',
          token: 'new-api-token',
        },
      });

      expect('routeToRetroSettings').toHaveBeenDispatchedWith({
        type: 'routeToRetroSettings',
        data: {
          retro_id: '13',
        },
      });

      expect('showAlert').toHaveBeenDispatchedWith({
        type: 'showAlert',
        data: {
          checkIcon: true,
          message: 'Password changed',
        },
      });
    });

    describe('when unprocessable entity is received', () => {
      beforeEach(() => {
        const request = jasmine.Ajax.requests.mostRecent();
        request.respondWith({status: 422, contentType: 'application/json', responseText: '{"errors": ["some error"]}'});
        Promise.runAll();
      });

      it('dispatches retroPasswordUnsuccessfullyUpdated', () => {
        expect('retroPasswordUnsuccessfullyUpdated').toHaveBeenDispatchedWith({
          type: 'retroPasswordUnsuccessfullyUpdated',
          data: {errors: ['some error']},
        });
      });
    });
  });

  describe('getRetro', () => {
    beforeEach(() => {
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      localStorage.setItem('apiToken-1', 'the-token');
      subject.dispatch({type: 'getRetro', data: {id: 1}});
    });

    it('makes an api GET to /retros/:id', () => {
      expect('/retros/1').toHaveBeenRequestedWith({
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({retro});
      Promise.runAll();
      expect('retroSuccessfullyFetched').toHaveBeenDispatchedWith({
        type: 'retroSuccessfullyFetched',
        data: {retro},
      });
    });

    describe('when forbidden is received', () => {
      it('dispatches requireRetroLogin', () => {
        const request = jasmine.Ajax.requests.mostRecent();
        request.forbidden();
        Promise.runAll();
        expect('requireRetroLogin').toHaveBeenDispatchedWith({
          type: 'requireRetroLogin',
          data: {retro_id: 1},
        });
      });
    });

    describe('when retro does not exist', () => {
      it('dispatches retroNotFound', () => {
        const request = jasmine.Ajax.requests.mostRecent();
        request.notFound();
        Promise.runAll();
        expect('retroNotFound').toHaveBeenDispatchedWith({
          type: 'retroNotFound',
        });
      });
    });
  });

  describe('getRetros', () => {
    beforeEach(() => {
      localStorage.setItem('authToken', 'the-auth-token');
      subject.$store = new Cursor({retros: []}, cursorSpy);
      subject.dispatch({type: 'getRetros'});
    });

    it('makes an API GET to /retros', () => {
      expect('/retros').toHaveBeenRequestedWith({
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'x-auth-token': 'the-auth-token',
        },
      });

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({retros: [retro]});
      Promise.runAll();
      expect('retrosSuccessfullyFetched').toHaveBeenDispatchedWith({
        type: 'retrosSuccessfullyFetched',
        data: {retros: [retro]},
      });

    });
  });

  describe('getRetroLogin', () => {
    beforeEach(() => {
      subject.$store = new Cursor({retro: null}, cursorSpy);
      subject.dispatch({type: 'getRetroLogin', data: {retro_id: 1}});
    });

    it('makes an api GET to /retros/:id/login', () => {
      expect('/retros/1/login').toHaveBeenRequestedWith({
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      });
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({retro: {id: 1, name: 'the-fetched-retro-login-name'}});
      Promise.runAll();
      expect('getRetroLoginSuccessfullyReceived').toHaveBeenDispatchedWith({
        type: 'getRetroLoginSuccessfullyReceived',
        data: {retro: {id: 1, name: 'the-fetched-retro-login-name'}},
      });
    });

    describe('when retro does not exist', () => {
      it('dispatches retroNotFound', () => {
        const request = jasmine.Ajax.requests.mostRecent();
        request.notFound();
        Promise.runAll();
        expect('retroNotFound').toHaveBeenDispatchedWith({
          type: 'retroNotFound',
        });
      });
    });
  });

  describe('getRetroSettings', () => {
    const doSetup = () => {
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'getRetroSettings', data: {id: 'retro-slug-123'}});
    };

    describe('GET /retros/:id/settings', () => {
      it('returns the retro settings when authenticated', () => {
        localStorage.setItem('apiToken-retro-slug-123', 'the-token');
        doSetup();

        expect('/retros/retro-slug-123/settings').toHaveBeenRequestedWith({
          requestHeaders: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': 'Bearer the-token',
          },
        });
        const request = jasmine.Ajax.requests.mostRecent();
        const response = {retro: {id: 1, name: 'the-fetched-retro-login-name', slug: 'retro-slug-123'}};
        request.succeed(response);
        Promise.runAll();
        expect('getRetroSettingsSuccessfullyReceived').toHaveBeenDispatchedWith({
          type: 'getRetroSettingsSuccessfullyReceived',
          data: response,
        });
      });

      it('is forbidden when not authenticated', () => {
        localStorage.setItem('apiToken-retro-slug-123', '');
        doSetup();

        expect('/retros/retro-slug-123/settings').toHaveBeenRequestedWith({
          requestHeaders: {
            'accept': 'application/json',
            'content-type': 'application/json',
          },
        });
        const request = jasmine.Ajax.requests.mostRecent();
        request.forbidden();
        Promise.runAll();
        expect('requireRetroLogin').toHaveBeenDispatchedWith({
          type: 'requireRetroLogin',
          data: {retro_id: 'retro-slug-123'},
        });
      });
    });
  });

  describe('loginToRetro', () => {
    beforeEach(() => {
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'loginToRetro', data: {retro_id: 15, password: 'pa55word'}});
    });

    it('makes an api PUT to /retros/:id/login', () => {
      expect('/retros/15/login').toHaveBeenRequestedWith({
        method: 'PUT',
        data: {retro: {password: 'pa55word'}},
      });
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({token: 'the-token'});
      Promise.runAll();
      expect(localStorage.getItem('apiToken-15')).toEqual('the-token');
      expect('retroSuccessfullyLoggedIn').toHaveBeenDispatchedWith({
        type: 'retroSuccessfullyLoggedIn',
        data: {retro_id: 15},
      });
    });

    describe('when password is wrong', () => {
      it('dispatches retroLoginFailed', () => {
        const request = jasmine.Ajax.requests.mostRecent();
        request.notFound();
        Promise.runAll();
        expect('retroLoginFailed').toHaveBeenDispatchedWith({
          type: 'retroLoginFailed',
        });
      });
    });

  });

  describe('deleteRetroItem', () => {
    let item;
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      item = retro.items[0];
      subject.dispatch({type: 'deleteRetroItem', data: {retro_id: 1, item: item}});
    });
    it('makes an api DELETE to /retros/:id/items/:item_id', () => {
      expect('/retros/1/items/2').toHaveBeenRequestedWith({
        method: 'DELETE',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      expect('retroItemSuccessfullyDeleted').toHaveBeenDispatchedWith({
        type: 'retroItemSuccessfullyDeleted',
        data: {retro_id: 1, item: item},
      });
    });
  });

  describe('createRetroItem', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'createRetroItem', data: {retro_id: 1, description: 'happy item', category: 'happy'}});
    });

    it('makes an api POST to /retros/:id/items', () => {
      expect('/retros/1/items').toHaveBeenRequestedWith({
        method: 'POST',
        requestHeaders: {
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
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({item: {id: 1, category: 'happy', description: 'this is an item'}});
      Promise.runAll();
      expect('retroItemSuccessfullyCreated').toHaveBeenDispatchedWith({
        type: 'retroItemSuccessfullyCreated',
        data: {item: {id: 1, category: 'happy', description: 'this is an item'}, retroId: 1},
      });
    });
  });

  describe('updateRetroItem', () => {
    let item;
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      item = retro.items[0];
      subject.dispatch({type: 'updateRetroItem', data: {retro_id: 1, item: item, description: 'updated description'}});
    });

    it('makes an api PATCH to /retros/:retro_id/items/:id', () => {
      expect(`/retros/1/items/${item.id}`).toHaveBeenRequestedWith({
        method: 'PATCH',
        requestHeaders: {
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
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      item = retro.items[0];
      subject.dispatch({type: 'deleteRetroItem', data: {retro_id: 1, item: item}});
    });

    it('makes an api DELETE to /retros/:id/items/:item_id', () => {
      expect('/retros/1/items/2').toHaveBeenRequestedWith({
        method: 'DELETE',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      expect('retroItemSuccessfullyDeleted').toHaveBeenDispatchedWith({
        type: 'retroItemSuccessfullyDeleted',
        data: {retro_id: 1, item: item},
      });
    });
  });

  describe('voteRetroItem', () => {
    let item;
    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'voteRetroItem', data: {retro_id: 1, item: item}});
    });
    it('makes an api POST to /retros/:id/items/:item_id/vote', () => {
      expect('/retros/1/items/2/vote').toHaveBeenRequestedWith({
        method: 'POST',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({item: item});
      Promise.runAll();

      expect('retroItemSuccessfullyVoted').toHaveBeenDispatchedWith({
        type: 'retroItemSuccessfullyVoted',
        data: {item: item},
      });
    });
  });

  describe('nextRetroItem', () => {
    it('makes an API POST to /retros/:id/discussion/transition', () => {
      realDispatchLevels = 2; // allow nextRetroItem and retroItemSuccessfullyDone

      localStorage.setItem('apiToken-1', 'the-token');
      retro.highlighted_item_id = 2;
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'nextRetroItem', data: {retro_id: 1}});

      expect('/retros/1/discussion/transition').toHaveBeenRequestedWith({
        method: 'POST',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {transition: 'NEXT'},
      });

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({retro: retro});
      Promise.runAll();

      expect('checkAllRetroItemsDone').toHaveBeenDispatchedWith({
        type: 'checkAllRetroItemsDone',
      });
    });

  });
  describe('highlightRetroItem', () => {
    let item;
    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'highlightRetroItem', data: {retro_id: 1, item: item}});
    });
    it('makes an api POST to /retros/:id/discussion', () => {
      expect('/retros/1/discussion').toHaveBeenRequestedWith({
        method: 'POST',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {item_id: 2},
      });

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({retro: retro});
      Promise.runAll();

      expect('retroItemSuccessfullyHighlighted').toHaveBeenDispatchedWith({
        type: 'retroItemSuccessfullyHighlighted',
        data: {retro: retro},
      });
    });
  });

  describe('unhighlightRetroItem', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'unhighlightRetroItem', data: {retro_id: 1}});
    });
    it('makes an api DELETE to /retros/:id/discussion', () => {
      expect('/retros/1/discussion').toHaveBeenRequestedWith({
        method: 'DELETE',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      expect('retroItemSuccessfullyUnhighlighted').toHaveBeenDispatched();
    });
  });

  describe('doneRetroItem', () => {
    let item;
    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'doneRetroItem', data: {retroId: 1, item: item}});
    });
    it('makes an api PATCH to /retros/:id/items/:item_id/done', () => {
      expect('/retros/1/items/2/done').toHaveBeenRequestedWith({
        method: 'PATCH',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      item = retro.items[0];
      item.done = true;
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({item: item});
      Promise.runAll();

      expect('retroItemSuccessfullyDone').toHaveBeenDispatchedWith({
        type: 'retroItemSuccessfullyDone',
        data: {retroId: 1, itemId: item.id},
      });
    });
  });

  describe('undoneRetroItem', () => {
    let item;

    beforeEach(() => {
      item = retro.items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'undoneRetroItem', data: {retroId: 1, item: item}});
    });

    it('makes an api PATCH to /retros/:id/items/:item_id/done', () => {
      expect('/retros/1/items/2/done').toHaveBeenRequestedWith({
        method: 'PATCH',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {
          done: false,
        },
      });

      const request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 204});
      Promise.runAll();

      expect('retroItemSuccessfullyUndone').toHaveBeenDispatchedWith({
        type: 'retroItemSuccessfullyUndone',
        data: {retroId: 1, item: item},
      });
    });
  });

  describe('extendTimer', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'extendTimer', data: {retro_id: 1}});
    });

    it('makes an api PATCH to /retros/:id/discussion', () => {
      expect('/retros/1/discussion').toHaveBeenRequestedWith({
        method: 'PATCH',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({retro: retro});
      Promise.runAll();

      expect('extendTimerSuccessfullyDone').toHaveBeenDispatchedWith({
        type: 'extendTimerSuccessfullyDone',
        data: {retro: retro},
      });
    });
  });

  describe('archiveRetro', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'archiveRetro', data: {retro: {slug: 1, send_archive_email: true}}});
    });

    it('makes an api PUT to /retros/:id/archive', () => {
      expect('/retros/1/archive').toHaveBeenRequestedWith({
        method: 'PUT',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {
          send_archive_email: true,
        },
      });

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({retro: retro});
      Promise.runAll();

      expect('archiveRetroSuccessfullyDone').toHaveBeenDispatchedWith({
        type: 'archiveRetroSuccessfullyDone',
        data: {retro: retro},
      });
    });
  });

  describe('createRetroActionItem', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'createRetroActionItem', data: {retro_id: 1, description: 'a new action item'}});
    });

    it('makes an api POST to /retros/:id/action_items', () => {
      expect('/retros/1/action_items').toHaveBeenRequestedWith({
        method: 'POST',
        requestHeaders: {
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
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'doneRetroActionItem', data: {retro_id: 1, action_item_id: 1, done: true}});
    });

    it('makes an api PATCH to /retros/:id/action_items/:action_item_id', () => {
      expect('/retros/1/action_items/1').toHaveBeenRequestedWith({
        method: 'PATCH',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
        data: {
          done: true,
        },
      });

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({action_item: action_item});
      Promise.runAll();

      expect('doneRetroActionItemSuccessfullyToggled').toHaveBeenDispatchedWith({
        type: 'doneRetroActionItemSuccessfullyToggled',
        data: {action_item: action_item},
      });
    });
  });

  describe('deleteRetroActionItem', () => {
    let action_item;
    beforeEach(() => {
      action_item = retro.action_items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'deleteRetroActionItem', data: {retro_id: 1, action_item: action_item}});
    });

    it('makes an api DELETE to /retros/:id/action_items/:action_item_id', () => {
      expect('/retros/1/action_items/1').toHaveBeenRequestedWith({
        method: 'DELETE',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      expect('retroActionItemSuccessfullyDeleted').toHaveBeenDispatchedWith({
        type: 'retroActionItemSuccessfullyDeleted',
        data: {action_item: action_item},
      });
    });
  });

  describe('editRetroActionItem', () => {
    let action_item;
    beforeEach(() => {
      action_item = retro.action_items[0];
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);

      subject.dispatch({
        type: 'editRetroActionItem',
        data: {retro_id: 1, action_item_id: action_item.id, description: 'this is a description'},
      });
    });

    it('makes an api PUT to /retros/:id/action_items/:action_item_id', () => {
      expect('/retros/1/action_items/1').toHaveBeenRequestedWith({
        method: 'PATCH',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({action_item: action_item});
      Promise.runAll();

      expect('retroActionItemSuccessfullyEdited').toHaveBeenDispatchedWith({
        type: 'retroActionItemSuccessfullyEdited',
        data: {action_item},
      });
    });
  });

  describe('getRetroArchives', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'getRetroArchives', data: {retro_id: '1'}});
    });

    it('makes an api GET to /retros/:retro_id/archives', () => {
      expect('/retros/1/archives').toHaveBeenRequestedWith({
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed();
      Promise.runAll();
      expect('retroArchivesSuccessfullyFetched').toHaveBeenDispatched();
    });

    describe('when retro does not exist', () => {
      it('dispatches retroNotFound', () => {
        const request = jasmine.Ajax.requests.mostRecent();
        request.notFound();
        Promise.runAll();
        expect('retroNotFound').toHaveBeenDispatchedWith({
          type: 'retroNotFound',
        });
      });
    });
  });

  describe('getRetroArchive', () => {
    beforeEach(() => {
      localStorage.setItem('apiToken-1', 'the-token');
      subject.$store = new Cursor({retro: retro}, cursorSpy);
      subject.dispatch({type: 'getRetroArchive', data: {retro_id: '1', archive_id: '1'}});
    });

    it('makes an api GET to /rertros/:retro_id/archives/:archive_id', () => {
      expect('/retros/1/archives/1').toHaveBeenRequestedWith({
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer the-token',
        },
      });
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed();
      Promise.runAll();
      expect('retroArchiveSuccessfullyFetched').toHaveBeenDispatched();
    });

    describe('when archives do not exist', () => {
      it('dispatches notFound', () => {
        const request = jasmine.Ajax.requests.mostRecent();
        request.notFound();
        Promise.runAll();
        expect('notFound').toHaveBeenDispatchedWith({
          type: 'notFound',
        });
      });
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({
        type: 'createUser',
        data: {access_token: 'the-access-token', company_name: 'Company name', full_name: 'My Full Name'},
      });
    });

    it('makes an api POST to /users', () => {
      expect('/users').toHaveBeenRequestedWith({
        method: 'POST',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        data: {
          'access_token': 'the-access-token',
          'company_name': 'Company name',
          'full_name': 'My Full Name',
        },
      });
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed();
      Promise.runAll();
      expect('redirectToRetroCreatePage').toHaveBeenDispatched();
    });

    it('stores the auth token in local storage', () => {
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({auth_token: 'the-token'});
      Promise.runAll();

      expect(localStorage.getItem('authToken')).toEqual('the-token');
    });
  });

  describe('createSession', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({
        type: 'createSession',
        data: {access_token: 'the-access-token', email: 'a@a.a', name: 'My full name'},
      });
    });

    it('makes an api POST to /sessions', () => {
      expect('/sessions').toHaveBeenRequestedWith({
        method: 'POST',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        data: {
          'access_token': 'the-access-token',
        },
      });
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed();
      Promise.runAll();
      expect('loggedInSuccessfully').toHaveBeenDispatched();
    });

    it('if the server returns a 404 because the user does not exist', () => {
      const request = jasmine.Ajax.requests.mostRecent();
      request.notFound();
      Promise.runAll();
      expect('redirectToRegistration').toHaveBeenDispatchedWith({
        type: 'redirectToRegistration',
        data: {
          'access_token': 'the-access-token',
          'email': 'a@a.a',
          'name': 'My full name',
        },
      });
    });

    it('stores the auth token in local storage', () => {
      realDispatchLevels = 2; // allow createSession and loggedInSuccessfully

      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed({auth_token: 'the-token'});
      Promise.runAll();

      expect(localStorage.getItem('authToken')).toEqual('the-token');
    });

  });

  describe('retrieveConfig', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'retrieveConfig', data: undefined});
    });

    it('makes an api GET to /config', () => {
      expect('/config').toHaveBeenRequestedWith({
        method: 'GET',
        requestHeaders: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      });
      const request = jasmine.Ajax.requests.mostRecent();
      request.succeed();
      Promise.runAll();
    });
  });
});
