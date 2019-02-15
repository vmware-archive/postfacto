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

import RetroWebsocket from './retro_websocket';
import ReactDOM from 'react-dom';
import '../spec_helper';

describe('RetroWebsocket', () => {

  describe('rendering a RetroWebsocket', () => {

    describe('when websocket url has been fetched', () => {
      let webSocketDOM;

      beforeEach(() => {
        webSocketDOM = ReactDOM.render(<RetroWebsocket url="wss://websocket/url" retro_id="retro-slug-123"/>, root);
      });

      it('should create setup cable', () => {
        const {cable} = webSocketDOM.state;
        expect(cable.url).toEqual('wss://websocket/url');
      });
    });
  });
});
