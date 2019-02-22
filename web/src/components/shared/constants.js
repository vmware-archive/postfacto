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

export const MAX_SLUG_LENGTH = 236;
export const VALID_SLUG_REGEX = /^[A-Za-z0-9-]+$/;
export const DEFAULT_TOGGLE_STYLE = {
  trackStyle: {
    'backgroundColor': '#C7C7C7',
    'borderRadius': '3px',
    'height': '2.125rem',
    'width': '5rem',
  },
  trackSwitchedStyle: {
    'backgroundColor': '#FEC722',
    'borderRadius': '3px',
  },
  labelStyle: {
    'marginLeft': '1.2rem',
    'paddingTop': '0.5rem',
    'fontWeight': 'bold',
  },
  thumbStyle: {
    'backgroundColor': 'white',
    'borderRadius': '3px',
    'marginTop': '0.6rem',
    'marginLeft': '0.6rem',
  },
  thumbSwitchedStyle: {
    'backgroundColor': 'white',
  },
  iconStyle: {
    'width': '4.5rem',
  },
};
