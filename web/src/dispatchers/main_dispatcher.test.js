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

import Cursor from 'pui-cursor';
import {Dispatcher} from 'p-flux';
import '../spec_helper';
import mainDispatcher from './main_dispatcher';

describe('MainDispatcher', () => {
  let subject;
  let cursorSpy;
  let retro;
  let retro_archives;
  let router;

  beforeEach(() => {
    Cursor.async = false;
    cursorSpy = jest.fn().mockName('callback');
    subject = Dispatcher;

    // dispatch is spied on in spec_helper
    subject.dispatch.mockCallThrough();

    // prevent console logs
    jest.spyOn(subject, 'onDispatch').mockReturnValue(null);

    router = {
      navigate: () => {
      },
    };
    subject.router = router;
    jest.spyOn(router, 'navigate').mockReturnValue(null);

    retro = {
      id: 1,
      name: 'retro name',
      slug: 'retro-name',
      items: [
        {
          id: 2,
          description: 'item 1',
          category: 'happy',
          vote_count: 1,
          done: false,
        },
        {
          id: 3,
          description: 'item 3',
          category: 'happy',
          vote_count: 2,
          done: true,
        },
      ],
      action_items: [
        {
          id: 1,
          description: 'action item 1',
          done: false,
        },
        {
          id: 2,
          description: 'action item 2',
          done: true,
        },
      ],
    };

    retro_archives = {
      id: 1,
      name: 'retro name',
      items: [
        {
          id: 2,
          description: 'item 1',
          vote_count: 1,
          done: false,
          archived_at: '2016-07-18T00:00:00.000Z',
        },
        {
          id: 3,
          description: 'item 3',
          vote_count: 2,
          done: true,
          archived_at: '2016-07-20T00:00:00.000Z',
        },
      ],
      action_items: [
        {
          id: 1,
          description: 'archived item 1',
          archived_at: '2016-07-18T00:00:00.000Z',
        },
        {
          id: 2,
          description: 'archived item 2',
          archived_at: '2016-07-20T00:00:00.000Z',
        },
      ],
    };
  });

  describe('setRoute', () => {
    it('calls the router navigate', () => {
      subject.dispatch({type: 'setRoute', data: '/url/path'});
      expect(router.navigate.mock.calls).toEqual([['/url/path']]);
    });
  });

  describe('retroSuccessfullyCreated', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        clearErrors: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      dispatcher.retroSuccessfullyCreated({data: {retro}});
    });

    it('redirects to the new retro page', () => {
      expect(dispatcher.dispatch).toHaveBeenCalledWith({type: 'setRoute', data: `/retros/${retro.slug}`});
    });

    it('dispatches created retro analytic', () => {
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: 'createdRetroAnalytics',
        data: {retroId: retro.id},
      });
    });

    it('empties the error messages', () => {
      expect(reduxActions.clearErrors).toHaveBeenCalled();
    });
  });

  describe('retroUnsuccessfullyCreated', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        errorsUpdated: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });


    it('updates the error messages', () => {
      dispatcher.retroUnsuccessfullyCreated({
        data: {
          errors: ['Sorry! That URL is already taken.'],
        },
      });

      expect(reduxActions.errorsUpdated).toHaveBeenCalledWith(['Sorry! That URL is already taken.']);
    });
  });

  describe('retroSuccessfullyFetched', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroUpdated: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('updates the retro', () => {
      dispatcher.retroSuccessfullyFetched({data: {retro: {name: 'The Retro Name', id: 2}}});

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith({name: 'The Retro Name', id: 2});
    });

    it('dispatches visited retro analytic', () => {
      dispatcher.retroSuccessfullyFetched({data: {retro: {name: 'The Retro Name', id: 2}}});

      expect(dispatcher.dispatch).toHaveBeenCalledWith({type: 'visitedRetroAnalytics', data: {retroId: 2}});
    });
  });

  describe('retrosSuccessfullyFetched', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        retrosUpdated: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('updates the retro', () => {
      const retros = [{name: 'The Retro Name', slug: 'the-retro-123'}];
      dispatcher.retrosSuccessfullyFetched({data: {retros}});

      expect(reduxActions.retrosUpdated).toHaveBeenCalledWith(retros);
    });
  });

  describe('getRetroSettingsSuccessfullyReceived', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroUpdated: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('updates the retro', () => {
      const updatedRetro = {name: 'The Retro Name', slug: 'the-retro-123'};
      dispatcher.getRetroSettingsSuccessfullyReceived({data: {retro: updatedRetro}});

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(updatedRetro);
    });
  });

  describe('getRetroLoginSuccessfullyReceived', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroUpdated: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('updates the retro name', () => {
      dispatcher.getRetroLoginSuccessfullyReceived({data: {retro: {name: 'The Retro Name'}}});
      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith({name: 'The Retro Name'});
    });
  });

  describe('retroSettingsSuccessfullyUpdated', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroUpdated: jest.fn(),
        clearErrors: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      dispatcher.retroSettingsSuccessfullyUpdated({
        data: {
          retro: {
            name: 'new retro name',
            slug: 'new-retro-slug',
          },
        },
      });
    });


    it('updates the retro slug and name, and clears the error message', () => {
      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith({
        name: 'new retro name',
        slug: 'new-retro-slug',
      });

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalled();
    });

    it('redirects to the retro page url with the new slug', () => {
      expect(dispatcher.dispatch).toHaveBeenCalledWith({type: 'setRoute', data: '/retros/new-retro-slug'});
    });
  });

  describe('retroSettingsUnsuccessfullyUpdated', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        errorsUpdated: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      dispatcher.retroSettingsUnsuccessfullyUpdated({
        data: {
          errors: ['Sorry! That URL is already taken.'],
        },
      });
    });

    it('updates the error messages', () => {
      expect(reduxActions.errorsUpdated).toHaveBeenCalledWith(['Sorry! That URL is already taken.']);
    });
  });

  describe('requireRetroLogin', () => {
    it('dispatches a set Route', () => {
      subject.dispatch({type: 'requireRetroLogin', data: {retro_id: 1}});
      expect(Dispatcher).toHaveReceived({
        type: 'setRoute',
        data: '/retros/1/login',
      });
    });
  });

  describe('requireRetroRelogin', () => {
    it('dispatches a set Route', () => {
      subject.dispatch({type: 'requireRetroRelogin', data: {retro: {slug: 'retro-slug-1'}}});
      expect(Dispatcher).toHaveReceived({
        type: 'setRoute',
        data: '/retros/retro-slug-1/relogin',
      });
    });
  });

  describe('redirectToRetroCreatePage', () => {
    it('dispatches a set Route to new retro page', () => {
      subject.dispatch({type: 'redirectToRetroCreatePage'});
      expect(Dispatcher).toHaveReceived({
        type: 'setRoute',
        data: '/retros/new',
      });
    });
  });

  describe('retroSuccessfullyLoggedIn', () => {
    it('dispatches a set Route', () => {
      subject.dispatch({type: 'retroSuccessfullyLoggedIn', data: {retro_id: 1}});
      expect(Dispatcher).toHaveReceived({
        type: 'setRoute',
        data: '/retros/1',
      });
    });
  });

  describe('retroItemSuccessfullyCreated', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroItemUpdated: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      dispatcher.retroItemSuccessfullyCreated({
        data: {
          item: {id: 10, category: 'happy'},
          retroId: retro.id,
        },
      });
    });


    it('creates the retro item', () => {
      expect(reduxActions.currentRetroItemUpdated).toHaveBeenCalledWith({id: 10, category: 'happy'});
    });

    it('dispatches created retro item analytic', () => {
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: 'createdRetroItemAnalytics',
        data: {retroId: retro.id, category: 'happy'},
      });
    });
  });

  describe('retroItemSuccessfullyDeleted', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroItemDeleted: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('deletes the retro item', () => {
      dispatcher.retroItemSuccessfullyDeleted({data: {retro_id: 1, item: retro.items[0]}});

      expect(reduxActions.currentRetroItemDeleted).toHaveBeenCalledWith(retro.items[0]);
    });
  });

  describe('retroItemSuccessfullyVoted', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroItemUpdated: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('updates the vote count on the retro item', () => {
      const itemFromApiResponse = {
        id: 1,
        vote_count: 50,
        updated_at: '2016-10-04T23:19:05.269Z',
      };

      dispatcher.retroItemSuccessfullyVoted({data: {retro_id: 1, item: itemFromApiResponse}});
      expect(reduxActions.currentRetroItemUpdated).toHaveBeenCalledWith(itemFromApiResponse);
    });
  });

  describe('retroItemSuccessfullyDone', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroItemDoneUpdated: jest.fn(),
      };

      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      dispatcher.retroItemSuccessfullyDone({data: {retroId: 1, itemId: 2}});
    });

    it('fires retroItemDoneUpdated with true', () => {
      expect(reduxActions.currentRetroItemDoneUpdated).toHaveBeenCalledWith(2, true);
    });
  });

  describe('retroItemSuccessfullyUndone', () => {
    let dispatcher;
    let reduxActions;

    let item;

    beforeEach(() => {
      reduxActions = {
        currentRetroItemDoneUpdated: jest.fn(),
      };

      item = {id: 2, done: false};
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      dispatcher.retroItemSuccessfullyUndone({data: {retroId: 1, item}});
    });


    it('updates the item to have attribute done = false', () => {
      item.done = false;
      retro.highlighted_item_id = null;
      expect(reduxActions.currentRetroItemDoneUpdated).toHaveBeenCalledWith(2, false);
    });
  });

  describe('retroItemSuccessfullyHighlighted', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroUpdated: jest.fn(),
      };

      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('updates retro in redux', () => {
      dispatcher.retroItemSuccessfullyHighlighted({data: {retro}});

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(retro);
    });
  });

  describe('retroItemSuccessfullyUnhighlighted', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroHighlightCleared: jest.fn(),
      };

      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('updates retro in redux', () => {
      dispatcher.retroItemSuccessfullyUnhighlighted({data: {retro}});

      expect(reduxActions.currentRetroHighlightCleared).toHaveBeenCalled();
    });
  });

  describe('toggleSendArchiveEmail', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroSendArchiveEmailUpdated: jest.fn(),
      };

      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('toggles archive email value', () => {
      dispatcher.toggleSendArchiveEmail({data: {currentSendArchiveEmail: false}});

      expect(reduxActions.currentRetroSendArchiveEmailUpdated).toHaveBeenCalledWith(true);
    });
  });

  describe('extendTimerSuccessfullyDone', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroUpdated: jest.fn(),
      };

      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('updates retro in redux', () => {
      dispatcher.extendTimerSuccessfullyDone({data: {retro}});

      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(retro);
    });
  });

  describe('archiveRetroSuccessfullyDone', () => {
    let dispatcher;
    let reduxActions;
    let updated_retro;

    beforeEach(() => {
      reduxActions = {
        currentRetroUpdated: jest.fn(),
      };

      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      updated_retro = {
        id: retro.id,
        name: retro.name,
        items: [],
        action_items: [retro.action_items[0]],
      };

      dispatcher.archiveRetroSuccessfullyDone({data: {retro: updated_retro}});
    });

    it('updates the retro', () => {
      retro.retro_item_end_time = 321;
      expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(updated_retro);
    });

    it('dispatches archived retro analytics', () => {
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: 'archivedRetroAnalytics',
        data: {retroId: retro.id},
      });
    });

    it('displays an alert', () => {
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: 'showAlert',
        data: {
          message: 'Archived!',
        },
      });
    });
  });

  describe('websocketRetroDataReceived', () => {
    describe('when the retro is updated', () => {
      let dispatcher;
      let reduxActions;

      beforeEach(() => {
        reduxActions = {
          currentRetroUpdated: jest.fn(),
        };

        dispatcher = mainDispatcher(reduxActions);
        dispatcher.dispatch = jest.fn();
      });

      it('updates store with data from socket', () => {
        dispatcher.websocketRetroDataReceived({data: {retro}});

        expect(reduxActions.currentRetroUpdated).toHaveBeenCalledWith(retro);
      });
    });

    describe('when the command is force_relogin', () => {
      let initialStore;

      beforeEach(() => {
        initialStore = {session: {request_uuid: 'fake-request-uuid-1'}};
        subject.$store = new Cursor(initialStore, cursorSpy);
      });

      describe('when the command was originated by someone else', () => {
        it('dispatches show alert with a password changed message', () => {
          subject.dispatch({
            type: 'websocketRetroDataReceived',
            data: {
              command: 'force_relogin',
              payload: {
                originator_id: 'fake-request-uuid-2',
                retro: {
                  slug: 'retro-slug-1',
                },
              },
            },
          });

          expect(Dispatcher).toHaveReceived({
            type: 'requireRetroRelogin',
            data: {
              retro: {
                slug: 'retro-slug-1',
              },
            },
          });
        });
      });

      describe('when the command was originated by me', () => {
        it('does not dispatch show alert', () => {
          subject.dispatch({
            type: 'websocketRetroDataReceived',
            data: {
              command: 'force_relogin',
              payload: {
                originator_id: 'fake-request-uuid-1',
              },
            },
          });

          expect(Dispatcher).not.toHaveReceived('requireRetroRelogin');
        });
      });
    });
  });

  describe('websocketSessionDataReceived', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
    });

    it('updates store with data from socket', () => {
      subject.dispatch({type: 'websocketSessionDataReceived', data: {payload: {request_uuid: 'some-request-uuid'}}});
      expect(cursorSpy).toHaveBeenCalledWith({session: {request_uuid: 'some-request-uuid'}});
    });
  });

  describe('doneRetroActionItemSuccessfullyToggled', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroActionItemUpdated: jest.fn(),
      };

      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });

    it('updates the store', () => {
      const actionItem = {id: 1, done: true};
      dispatcher.doneRetroActionItemSuccessfullyToggled({data: {action_item: actionItem}});
      expect(reduxActions.currentRetroActionItemUpdated).toHaveBeenCalledWith(actionItem);
    });

    describe('when action item is marked as done', () => {
      it('dispatches completed retro action item analytic', () => {
        dispatcher.doneRetroActionItemSuccessfullyToggled({data: {action_item: {id: 1, done: true}, retro_id: 222}});
        expect(dispatcher.dispatch).toHaveBeenCalledWith({
          type: 'doneActionItemAnalytics',
          data: {retroId: 222},
        });
      });
    });

    describe('when action item is marked as undone', () => {
      it('does not dispatch anything', () => {
        dispatcher.doneRetroActionItemSuccessfullyToggled({data: {action_item: {id: 2, done: false}, retro_id: 222}});
        expect(dispatcher.dispatch).toHaveBeenCalledWith({
          type: 'undoneActionItemAnalytics',
          data: {retroId: 222},
        });
      });
    });
  });

  describe('retroActionItemSuccessfullyDeleted', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroActionItemDeleted: jest.fn(),
      };

      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });


    it('updates the store and removes the retro action item', () => {
      const action_item = retro.action_items[0];

      dispatcher.retroActionItemSuccessfullyDeleted({data: {action_item}});

      expect(reduxActions.currentRetroActionItemDeleted).toHaveBeenCalledWith(action_item);
    });
  });

  describe('retroActionItemSuccessfullyEdited', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        currentRetroActionItemUpdated: jest.fn(),
      };

      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
    });


    it('updates description of the action item', () => {
      const action_item = retro.action_items[0];
      action_item.description = 'description for action item 1 has been changed';
      dispatcher.retroActionItemSuccessfullyEdited({data: {retroId: 1, action_item}});

      expect(reduxActions.currentRetroActionItemUpdated).toHaveBeenCalledWith(action_item);
    });
  });

  describe('retroArchiveSuccessfullyFetched', () => {
    beforeEach(() => {
      subject.$store = new Cursor({retro_archives: {}}, cursorSpy);
      subject.dispatch({type: 'retroArchiveSuccessfullyFetched', data: {retro: retro_archives}});
    });
    it('updates the store with the archived retro items', () => {
      expect(cursorSpy).toHaveBeenCalledWith({retro_archives});
    });
  });

  describe('retroArchivesSuccessfullyFetched', () => {
    beforeEach(() => {
      subject.$store = new Cursor({archives: []}, cursorSpy);
      subject.dispatch({type: 'retroArchivesSuccessfullyFetched', data: {archives: [{id: 123}]}});
    });
    it('updates the store with the archives', () => {
      expect(cursorSpy).toHaveBeenCalledWith({archives: [{id: 123}]});
    });
  });

  describe('backPressedFromArchives', () => {
    beforeEach(() => {
      subject.dispatch({type: 'backPressedFromArchives', data: {retro_id: '1'}});
    });
    it('sets the route back to the current retro', () => {
      expect(Dispatcher).toHaveReceived({type: 'setRoute', data: '/retros/1'});
    });
  });

  describe('backPressedFromPasswordSettings', () => {
    beforeEach(() => {
      subject.dispatch({type: 'backPressedFromPasswordSettings', data: {retro_id: '1'}});
    });
    it('sets the route back to the current retro', () => {
      expect(Dispatcher).toHaveReceived({type: 'setRoute', data: '/retros/1/settings'});
    });
  });

  describe('showAlert', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({
        type: 'showAlert',
        data: {
          message: 'this is a message',
        },
      });
    });

    it('adds the alert message to the store', () => {
      expect(cursorSpy).toHaveBeenCalledWith({
        alert: {message: 'this is a message'},
      });
    });

    it('schedules removal of the message after a delay', () => {
      jest.advanceTimersByTime(2000);
      expect(Dispatcher).not.toHaveReceived('hideAlert');

      jest.advanceTimersByTime(2000);
      expect(Dispatcher).toHaveReceived('hideAlert');
    });

    it('resets the removal countdown if the message updates', () => {
      jest.advanceTimersByTime(2000);
      expect(Dispatcher).not.toHaveReceived('hideAlert');

      subject.dispatch({
        type: 'showAlert',
        data: {message: 'a new message'},
      });

      jest.advanceTimersByTime(2000);
      expect(Dispatcher).not.toHaveReceived('hideAlert');

      jest.advanceTimersByTime(2000);
      expect(Dispatcher).toHaveReceived('hideAlert');
    });
  });

  describe('hideAlert', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'hideAlert'});
    });
    it('clears the alert message from the store', () => {
      expect(cursorSpy).toHaveBeenCalledWith({alert: null});
    });
  });

  describe('showDialog', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
    });

    it('adds dialog to the store', () => {
      subject.dispatch({
        type: 'showDialog',
        data: {
          title: 'Some title',
          message: 'Some message',
        },
      });

      expect(cursorSpy).toHaveBeenCalledWith({
        dialog: {
          title: 'Some title',
          message: 'Some message',
        },
      });
    });
  });

  describe('hideDialog', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
    });

    it('clears the dialog from the store', () => {
      subject.dispatch({type: 'hideDialog'});

      expect(cursorSpy).toHaveBeenCalledWith({dialog: null});
    });
  });

  describe('retroNotFound', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'retroNotFound'});
    });
    it('updates the store with retro not found', () => {
      expect(cursorSpy).toHaveBeenCalledWith({retro_not_found: true});
    });
  });

  describe('resetRetroNotFound', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'resetRetroNotFound'});
    });
    it('updates the store with retro not found to false', () => {
      expect(cursorSpy).toHaveBeenCalledWith({retro_not_found: false});
    });
  });

  describe('resetNotFound', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'resetNotFound'});
    });
    it('updates the store with not found to false', () => {
      expect(cursorSpy).toHaveBeenCalledWith({not_found: false});
    });
  });

  describe('resetApiServerNotFound', () => {
    it('updates the store with not found to false', () => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'resetApiServerNotFound'});

      expect(cursorSpy).toHaveBeenCalledWith({api_server_not_found: false});
    });
  });

  describe('notFound', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'notFound'});
    });
    it('updates the store with not found', () => {
      expect(cursorSpy).toHaveBeenCalledWith({not_found: true});
    });
  });

  describe('signOut', () => {
    beforeEach(() => {
      localStorage.setItem('a', 'b');

      subject.dispatch({type: 'signOut'});
    });

    it('clears local storage', () => {
      expect(localStorage.length).toEqual(0);
    });

    it('redirects to home page', () => {
      expect(Dispatcher).toHaveReceived({type: 'setRoute', data: '/'});
    });
  });

  describe('routeToRetroPasswordSettings', () => {
    beforeEach(() => {
      subject.dispatch({type: 'routeToRetroPasswordSettings', data: {retro_id: '13'}});
    });

    it('routes to the retro password settings page', () => {
      expect(Dispatcher).toHaveReceived({type: 'setRoute', data: '/retros/13/settings/password'});
    });
  });

  describe('retroPasswordSuccessfullyUpdated', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        clearErrors: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      dispatcher.retroPasswordSuccessfullyUpdated({data: {retro_id: '42', token: 'new-api-token'}});
    });

    it('clears the error messages', () => {
      expect(reduxActions.clearErrors).toHaveBeenCalled();
    });

    it('updates token in local storage', () => {
      expect(localStorage.getItem('apiToken-42')).toEqual('new-api-token');
    });
  });

  describe('retroPasswordUnsuccessfullyUpdated', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        errorsUpdated: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      dispatcher.retroPasswordUnsuccessfullyUpdated({
        data: {
          errors: ['Sorry! That password does not match the current one.'],
        },
      });
    });

    it('updates the error messages', () => {
      expect(reduxActions.errorsUpdated).toHaveBeenCalledWith(['Sorry! That password does not match the current one.']);
    });
  });

  describe('clearErrors', () => {
    let dispatcher;
    let reduxActions;

    beforeEach(() => {
      reduxActions = {
        clearErrors: jest.fn(),
      };
      dispatcher = mainDispatcher(reduxActions);
      dispatcher.dispatch = jest.fn();
      dispatcher.clearErrors();
    });

    it('clears the error messages', () => {
      expect(reduxActions.clearErrors).toHaveBeenCalled();
    });
  });

  describe('apiServerNotFound', () => {
    it('updates the store with api server not found', () => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'apiServerNotFound'});

      expect(cursorSpy).toHaveBeenCalledWith({api_server_not_found: true});
    });
  });

  describe('redirectToRegistration', () => {
    it('redirects to the registration page with the correct url parameters', () => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({
        type: 'redirectToRegistration',
        data: {access_token: 'the-access-token', email: 'a@a.a', name: 'my full name'},
      });

      expect(Dispatcher).toHaveReceived({
        type: 'setRoute',
        data: '/registration/the-access-token/a@a.a/my full name',
      });
      expect(router.navigate.mock.calls).toEqual([['/registration/the-access-token/a@a.a/my full name']]);
    });
  });

  describe('setCountryCode', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);

      subject.dispatch({
        type: 'setCountryCode',
        data: {
          countryCode: 'anything',
        },
      });
    });

    it('updates the all the flags', () => {
      expect(cursorSpy).toHaveBeenCalledWith({
        countryCode: 'anything',
      });
    });
  });
});
