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
import RetroActionsColumnItem from './retro_actions_column_item';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function dateToMillis(date) {
  return new Date(date).getTime();
}

export default class RetroActionsColumn extends React.Component {
  static propTypes = {
    category: types.string.isRequired,
    retro: types.object.isRequired,
    retroId: types.string.isRequired,
    archives: types.bool,
    doneRetroActionItem: types.func.isRequired,
    deleteRetroActionItem: types.func.isRequired,
    editRetroActionItem: types.func.isRequired,
  };

  static defaultProps = {
    archives: false,
  };

  renderActionItems() {
    const {category, archives, retroId, retro: {action_items}} = this.props;
    const that = this;

    if (!action_items) {
      return null;
    }

    return action_items
      .filter((action_item) => {
        if (archives) {
          return category === 'current';
        }
        const createdAt = new Date(action_item.created_at);
        const lastWeekDate = that.getDateOfLatestItemThatIsNotToday();

        if (category === 'current') {
          return that.isToday(createdAt);
        }

        if (!lastWeekDate) {
          return false;
        }
        if (category === 'last-week') {
          return that.isSameDate(lastWeekDate, createdAt);
        }
        return createdAt < lastWeekDate;
      })
      .sort((a, b) => (dateToMillis(b.created_at) - dateToMillis(a.created_at)))
      .map((action_item) => (
        <RetroActionsColumnItem
          key={action_item.id}
          retroId={retroId}
          action_item={action_item}
          archives={archives}
          doneRetroActionItem={this.props.doneRetroActionItem}
          deleteRetroActionItem={this.props.deleteRetroActionItem}
          editRetroActionItem={this.props.editRetroActionItem}
        />
      ));
  }

  isToday(createdAt) {
    const date = new Date(Date.now());
    return this.isSameDate(createdAt, date);
  }

  isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  renderCurrentDateString() {
    const date = new Date(Date.now());
    return monthNames[date.getMonth()] + ' ' + date.getDate();
  }

  renderLastWeekDateString() {
    const date = this.getDateOfLatestItemThatIsNotToday();
    if (date) {
      return monthNames[date.getMonth()] + ' ' + date.getDate();
    }
    return '';
  }

  getDateOfLatestItemThatIsNotToday() {
    const {retro: {action_items = []}} = this.props;

    const timestamps = action_items
      .filter((action_item) => action_item.created_at)
      .map((action_item) => new Date(action_item.created_at))
      .filter((date) => !this.isToday(date))
      .map((date) => {
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      });

    if (!timestamps.length) {
      return null;
    }

    return new Date(Math.max(...timestamps));
  }

  renderDate() {
    const {category, archives} = this.props;
    if (category === 'current') {
      if (archives) {
        return 'Completed action items';
      }
      return 'Today (' + this.renderCurrentDateString() + ')';
    }

    if (category === 'last-week') {
      return this.renderLastWeekDateString();
    }
    return archives ? '' : 'Older';
  }

  render() {
    const {category} = this.props;
    return (
      <div className={'retro-actions-' + category}>
        <div className="retro-action-list-header">
          {
            this.renderDate()
          }
        </div>
        {
          this.renderActionItems()
        }
      </div>
    );
  }
}
