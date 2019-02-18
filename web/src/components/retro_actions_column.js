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
import jQuery from 'jquery';

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
  };

  renderActionItems() {
    const {category, archives, retro, retroId, retro: {action_items}} = this.props;
    let that = this;

    if (!action_items) {
      return null;
    }

    return action_items
      .filter((action_item) => {
        if (archives) {
          return category === 'current';
        }
        let createdAt = new Date(action_item.created_at);
        let lastWeekDate = that.getDateOfLatestItemThatIsNotToday();

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
        <RetroActionsColumnItem key={action_item.id} retro={retro} retroId={retroId} action_item={action_item} archives={archives}/>
      ));
  }

  isToday(createdAt) {
    const date = new Date(Date.now());
    return this.isSameDate(createdAt, date);
  }

  isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  renderCurrentDateString() {
    let date = new Date(Date.now());
    return monthNames[date.getMonth()] + ' ' + date.getDate();
  }

  renderLastWeekDateString() {
    let date = this.getDateOfLatestItemThatIsNotToday();
    if (date) {
      return monthNames[date.getMonth()] + ' ' + date.getDate();
    }
    return '';
  }

  getDateOfLatestItemThatIsNotToday() {
    const {retro: {action_items}} = this.props;
    let that = this;
    let timestamps = new Set();
    jQuery.each(action_items, (_, action_item) => {
      if (action_item.created_at) {
        let date = new Date(action_item.created_at);
        if (date && !that.isToday(date)) {
          const thing = date.setHours(0, 0, 0, 0);
          timestamps.add(thing);
        }
      }
    });
    if (!timestamps.size) {
      return null;
    }
    const orderedTimestamps = Array.from(timestamps).sort((a, b) => (b - a));

    return new Date(orderedTimestamps[0]);
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
