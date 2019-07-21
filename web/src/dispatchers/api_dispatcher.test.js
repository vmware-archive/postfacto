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

import apiDispatcher from './api_dispatcher';

describe('ApiDispatcher', () => {
  let boundActionCreators;
  let dispatcher;

  beforeEach(() => {
    boundActionCreators = {
      retroCreate: jest.fn(),
      getRetro: jest.fn(),
      getRetroSettings: jest.fn(),
      getRetroLogin: jest.fn(),
      loginToRetro: jest.fn(),
      createRetroItem: jest.fn(),
      updateRetroItem: jest.fn(),
      deleteRetroItem: jest.fn(),
      voteRetroItem: jest.fn(),
      nextRetroItem: jest.fn(),
      highlightRetroItem: jest.fn(),
      unhighlightRetroItem: jest.fn(),
      doneRetroItem: jest.fn(),
      undoneRetroItem: jest.fn(),
      extendTimer: jest.fn(),
      archiveRetro: jest.fn(),
      createRetroActionItem: jest.fn(),
      doneRetroActionItem: jest.fn(),
      deleteRetroActionItem: jest.fn(),
      editRetroActionItem: jest.fn(),
      getRetroArchive: jest.fn(),
      getRetroArchives: jest.fn(),
      createUser: jest.fn(),
      createSession: jest.fn(),
      updateRetroSettings: jest.fn(),
      updateRetroPassword: jest.fn(),
      retrieveConfig: jest.fn(),
    };
    dispatcher = apiDispatcher(boundActionCreators);
  });

  it('retroCreate', () => {
    const retro = {name: 1};
    dispatcher.retroCreate({data: retro});
    expect(boundActionCreators.retroCreate).toHaveBeenCalledWith(retro);
  });

  it('getRetro', () => {
    dispatcher.getRetro({data: {id: 1}});
    expect(boundActionCreators.getRetro).toHaveBeenCalledWith(1);
  });

  it('getRetroSettings', () => {
    dispatcher.getRetroSettings({data: {id: 1}});
    expect(boundActionCreators.getRetroSettings).toHaveBeenCalledWith(1);
  });

  it('getRetroLogin', () => {
    dispatcher.getRetroLogin({data: {retro_id: 1}});
    expect(boundActionCreators.getRetroLogin).toHaveBeenCalledWith(1);
  });

  it('loginToRetro', () => {
    dispatcher.loginToRetro({data: {retro_id: 1, password: 'p'}});
    expect(boundActionCreators.loginToRetro).toHaveBeenCalledWith(1, 'p');
  });

  it('createRetroItem', () => {
    dispatcher.createRetroItem({data: {retro_id: 'a', category: 'cat', description: 'des'}});
    expect(boundActionCreators.createRetroItem).toHaveBeenCalledWith('a', 'cat', 'des');
  });

  it('updateRetroItem', () => {
    const item = {id: 1};
    dispatcher.updateRetroItem({data: {retro_id: 'a', item, description: 'des'}});
    expect(boundActionCreators.updateRetroItem).toHaveBeenCalledWith('a', item, 'des');
  });

  it('deleteRetroItem', () => {
    const item = {id: 1};
    dispatcher.deleteRetroItem({data: {retro_id: 'a', item}});
    expect(boundActionCreators.deleteRetroItem).toHaveBeenCalledWith('a', item);
  });

  it('voteRetroItem', () => {
    const item = {id: 1};
    dispatcher.voteRetroItem({data: {retro_id: 'a', item}});
    expect(boundActionCreators.voteRetroItem).toHaveBeenCalledWith('a', item);
  });

  it('nextRetroItem', () => {
    const retro = {id: 1};
    dispatcher.nextRetroItem({data: {retro}});
    expect(boundActionCreators.nextRetroItem).toHaveBeenCalledWith(retro);
  });

  it('highlightRetroItem', () => {
    const item = {id: 1};
    dispatcher.highlightRetroItem({data: {retro_id: 'a', item}});
    expect(boundActionCreators.highlightRetroItem).toHaveBeenCalledWith('a', item);
  });

  it('unhighlightRetroItem', () => {
    dispatcher.unhighlightRetroItem({data: {retro_id: 'a'}});
    expect(boundActionCreators.unhighlightRetroItem).toHaveBeenCalledWith('a');
  });

  it('doneRetroItem', () => {
    const item = {id: 1};
    dispatcher.doneRetroItem({data: {retroId: 'a', item}});
    expect(boundActionCreators.doneRetroItem).toHaveBeenCalledWith('a', item);
  });

  it('undoneRetroItem', () => {
    const item = {id: 1};
    dispatcher.undoneRetroItem({data: {retroId: 'a', item}});
    expect(boundActionCreators.undoneRetroItem).toHaveBeenCalledWith('a', item);
  });

  it('extendTimer', () => {
    dispatcher.extendTimer({data: {retro_id: 'a'}});
    expect(boundActionCreators.extendTimer).toHaveBeenCalledWith('a');
  });

  it('archiveRetro', () => {
    const retro = {id: 1};
    dispatcher.archiveRetro({data: {retro}});
    expect(boundActionCreators.archiveRetro).toHaveBeenCalledWith(retro);
  });

  it('createRetroActionItem', () => {
    dispatcher.createRetroActionItem({data: {retro_id: 'a', description: 'b'}});
    expect(boundActionCreators.createRetroActionItem).toHaveBeenCalledWith('a', 'b');
  });

  it('doneRetroActionItem', () => {
    dispatcher.doneRetroActionItem({data: {retro_id: 'a', action_item_id: 'b', done: true}});
    expect(boundActionCreators.doneRetroActionItem).toHaveBeenCalledWith('a', 'b', true);
  });

  it('deleteRetroActionItem', () => {
    const actionItem = {id: 1};
    dispatcher.deleteRetroActionItem({data: {retro_id: 'a', action_item: actionItem}});
    expect(boundActionCreators.deleteRetroActionItem).toHaveBeenCalledWith('a', actionItem);
  });

  it('editRetroActionItem', () => {
    dispatcher.editRetroActionItem({data: {retro_id: 'a', action_item_id: 'b', description: 'des'}});
    expect(boundActionCreators.editRetroActionItem).toHaveBeenCalledWith('a', 'b', 'des');
  });

  it('getRetroArchive', () => {
    dispatcher.getRetroArchive({data: {retro_id: 'a', archive_id: 'b'}});
    expect(boundActionCreators.getRetroArchive).toHaveBeenCalledWith('a', 'b');
  });

  it('getRetroArchives', () => {
    dispatcher.getRetroArchives({data: {retro_id: 'a'}});
    expect(boundActionCreators.getRetroArchives).toHaveBeenCalledWith('a');
  });

  it('createUser', () => {
    dispatcher.createUser({data: {access_token: 'token', company_name: 'company', full_name: 'name'}});
    expect(boundActionCreators.createUser).toHaveBeenCalledWith('token', 'company', 'name');
  });

  it('createSession', () => {
    dispatcher.createSession({data: {access_token: 'token', email: 'email', name: 'name'}});
    expect(boundActionCreators.createSession).toHaveBeenCalledWith('token', 'email', 'name');
  });

  it('updateRetroSettings', () => {
    dispatcher.updateRetroSettings({
      data: {
        retro_id: 'a',
        retro_name: 'name',
        new_slug: 'newslug',
        old_slug: 'oldslug',
        is_private: true,
        video_link: 'http://www.example.com',
        request_uuid: 'uuid',
      },
    });
    expect(boundActionCreators.updateRetroSettings).toHaveBeenCalledWith('a', 'name', 'newslug', 'oldslug', true, 'uuid', 'http://www.example.com');
  });

  it('updateRetroPassword', () => {
    dispatcher.updateRetroPassword({
      data: {
        retro_id: 'id',
        current_password: 'currentpass',
        new_password: 'newpass',
        request_uuid: 'uuid',
      },
    });
    expect(boundActionCreators.updateRetroPassword).toHaveBeenCalledWith('id', 'currentpass', 'newpass', 'uuid');
  });

  it('retrieveConfig', () => {
    dispatcher.retrieveConfig();
    expect(boundActionCreators.retrieveConfig).toHaveBeenCalled();
  });
});
