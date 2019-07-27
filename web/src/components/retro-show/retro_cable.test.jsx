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
import {mount} from 'enzyme';
import ActionCable from 'actioncable';
import '../../spec_helper';

import RetroCable from './retro_cable';

describe('RetroCable', () => {
  let retroCableDOM;
  let websocketRetroDataReceived;

  beforeEach(() => {
    websocketRetroDataReceived = jest.fn();
    const cable = ActionCable.createConsumer('wss://websocket/url');
    retroCableDOM = mount(<RetroCable cable={cable} retro_id="retro-slug-123" websocketRetroDataReceived={websocketRetroDataReceived}/>);
  });

  it('subscribes to the channels', () => {
    const {subscription} = retroCableDOM.instance().state;
    const subscriptionJson = JSON.parse(subscription.identifier);
    expect(subscriptionJson.channel).toEqual('RetrosChannel');
    expect(subscriptionJson.retro_id).toEqual('retro-slug-123');
  });
});
