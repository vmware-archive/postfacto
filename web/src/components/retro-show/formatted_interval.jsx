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
import PropTypes from 'prop-types';

function formatInterval(secondsRemaining) {
  const roundedSeconds = Math.max(Math.floor(secondsRemaining), 0);
  const minutes = Math.floor(roundedSeconds / 60);
  const seconds = roundedSeconds % 60;
  const stringSeconds = seconds + '';
  return minutes + ':' + '00'.substr(stringSeconds.length) + stringSeconds;
}

const FormattedInterval = ({secondsRemaining}) => (
  <div className="formatted-interval">{formatInterval(secondsRemaining)}</div>
);

FormattedInterval.propTypes = {
  secondsRemaining: PropTypes.number.isRequired,
};

export default FormattedInterval;
