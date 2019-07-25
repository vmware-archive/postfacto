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

export default function (analyticsClient) {
  return {
    createdRetroAnalytics({data}) {
      analyticsClient.track('Created Retro', {'retroId': data.retroId});
    },
    visitedRetroAnalytics({data}) {
      analyticsClient.track('Retro visited', {'retroId': data.retroId});
    },
    createdRetroItemAnalytics({data}) {
      analyticsClient.track('Created Retro Item', {'retroId': data.retroId, 'category': data.category});
    },
    completedRetroItemAnalytics({data}) {
      analyticsClient.track('Completed Retro Item', {'retroId': data.retroId, 'category': data.category});
    },
    createdActionItemAnalytics({data}) {
      analyticsClient.track('Created Action Item', {'retroId': data.retroId});
    },
    doneActionItemAnalytics({data}) {
      analyticsClient.track('Done Action Item', {'retroId': data.retroId});
    },
    undoneActionItemAnalytics({data}) {
      analyticsClient.track('Undone Action Item', {'retroId': data.retroId});
    },
    archivedRetroAnalytics({data}) {
      analyticsClient.track('Archived Retro', {'retroId': data.retroId});
    },
    showHomePageAnalytics() {
      analyticsClient.track('Loaded homepage');
    },
  };
}
