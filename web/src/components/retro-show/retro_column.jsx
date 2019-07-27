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
import types from 'prop-types';
import RetroColumnInput from './retro_column_input';
import RetroColumnItem from './retro_column_item';
import happySvg from '../../images/happy.svg';
import mehSvg from '../../images/meh.svg';
import sadSvg from '../../images/sad.svg';

const imageMap = new Map();
imageMap.set('happy', happySvg);
imageMap.set('meh', mehSvg);
imageMap.set('sad', sadSvg);

export default class RetroColumn extends React.Component {
  static propTypes = {
    category: types.string.isRequired,
    retro: types.object.isRequired,
    retroId: types.string.isRequired,
    archives: types.bool,
    isMobile: types.bool.isRequired,
    voteRetroItem: types.func.isRequired,
    doneRetroItem: types.func.isRequired,
    undoneRetroItem: types.func.isRequired,
    highlightRetroItem: types.func.isRequired,
    unhighlightRetroItem: types.func.isRequired,
    updateRetroItem: types.func.isRequired,
    deleteRetroItem: types.func.isRequired,
    createRetroActionItem: types.func.isRequired,
    createRetroItem: types.func.isRequired,
    extendTimer: types.func.isRequired,
  };

  static defaultProps = {
    archives: false,
  };

  renderRetroItems() {
    const {
      archives,
      retroId,
      retro: {items, highlighted_item_id, retro_item_end_time},
      category,
      isMobile,
    } = this.props;

    if (!items) {
      return null;
    }

    return items
      .filter((item) => item.category === category)
      .sort((a, b) => (b.created_at <= a.created_at ? -1 : 1))
      .map((item) => (
        <RetroColumnItem
          key={item.id}
          retroId={retroId}
          item={item}
          highlighted_item_id={highlighted_item_id}
          retro_item_end_time={retro_item_end_time}
          archives={archives}
          isMobile={isMobile}
          voteRetroItem={this.props.voteRetroItem}
          doneRetroItem={this.props.doneRetroItem}
          undoneRetroItem={this.props.undoneRetroItem}
          highlightRetroItem={this.props.highlightRetroItem}
          unhighlightRetroItem={this.props.unhighlightRetroItem}
          updateRetroItem={this.props.updateRetroItem}
          deleteRetroItem={this.props.deleteRetroItem}
          extendTimer={this.props.extendTimer}
        />
      ));
  }

  renderColumnHeader() {
    const {category, isMobile} = this.props;
    if (isMobile) {
      return null;
    }
    return (
      <div className="retro-item-list-header">
        <img src={imageMap.get(category)} alt={category}/>
      </div>
    );
  }

  renderInput() {
    const {category, retroId, archives} = this.props;
    if (archives) {
      return null;
    }
    return (
      <RetroColumnInput
        retroId={retroId}
        category={category}
        createRetroItem={this.props.createRetroItem}
        createRetroActionItem={this.props.createRetroActionItem}
      />
    );
  }

  render() {
    const {category} = this.props;
    return (
      <div className={'column-' + category}>
        {
          this.renderColumnHeader()
        }
        {
          this.renderInput()
        }
        {
          this.renderRetroItems()
        }
      </div>
    );
  }
}
