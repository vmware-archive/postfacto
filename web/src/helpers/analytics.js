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
import Mixpanel from 'mixpanel-browser';

const POSTFACTO_TEAM_ANALYTICS_TOKEN = "d4de349453cc697734eced9ebedcdb22";

export default class Analytics {
  static initialized = false;

  static track(event, options) {
    if (global.Retro.config.enable_analytics) {
      if (!Analytics.initialized) {
        Mixpanel.init(POSTFACTO_TEAM_ANALYTICS_TOKEN);
        Analytics.initialized = true;
      }

      options = options || {};
      options.timestamp = (new Date()).toJSON();
      Mixpanel.track(event, options);
    }
  }
}
