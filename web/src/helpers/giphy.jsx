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
import RetroApi from '../api/retro_api';

export default class Giphy {
  static matcher = /\/giphy\s([^\s]+)/g;

  constructor(retroId) {
    this.retroId = retroId;
  }

  async isSupported() {
    try {
      if (this.supported === undefined) {
        const [status] = await RetroApi.getRetroGif(this.retroId, 'supported');
        this.supported = status === 200;
      }
    } catch {
      this.supported = false;
    }
    return this.supported;
  }

  async interpolate(input) {
    const matches = input.match(Giphy.matcher);
    if (matches === null) {
      return input;
    }

    if (!(await this.isSupported())) {
      return input;
    }

    let temp = input;
    const result = [];

    // eslint-disable-next-line
    for (const match of matches) {
      // fetch the keyword for gif search
      const keyword = encodeURI(match.replace('/giphy ', ''));

      // find the substring to process and cut
      const startIndex = temp.indexOf(match);
      const endIndex = startIndex + match.length;

      // force whole array to be await compatible
      result.push(Promise.resolve(temp.substring(0, startIndex)));

      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await RetroApi.getRetroGif(this.retroId, keyword);
        const {url} = response[1];
        result.push(<img key={keyword} src={url} alt={keyword}/>);
      } catch {
        result.push(Promise.resolve(match));
      }

      // cut the processed string
      temp = temp.substring(endIndex, temp.length);
    }

    result.push(Promise.resolve(temp));
    return Promise.all(result);
  }
}
