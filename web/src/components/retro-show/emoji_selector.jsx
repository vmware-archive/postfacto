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
import * as PropTypes from 'prop-types';

export default class EmojiSelector extends React.Component {
    static propTypes = {
      onSelect: PropTypes.func.isRequired,
    };

    static ranges = [
      {name: 'Smiley Faces', range: [0x1F600, 0x1F64F]},
      // Add more ranges here to support more unicode subsets
    ];

    renderCodepointRange(range) {
      const {onSelect} = this.props;
      const result = [];
      for (let [index, to] = range; index < to; index += 1) {
        const emoji = String.fromCodePoint(index);
        result.push((
          <span key={emoji} className="emoji-selector-option" onMouseDown={(event) => onSelect(event, emoji)}>
            {emoji}
          </span>
        ));
      }
      return result;
    }

    render() {
      return (
        <div className="emoji-selector">
          {EmojiSelector.ranges.map(({name, range}) => (
            <div key={name} className="emoji-selector-group">
              <h1>{name}</h1>
              {this.renderCodepointRange(range)}
            </div>
          ))}
        </div>
      );
    }
}
