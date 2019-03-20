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

export default function Footer({config}) {
  return (
    <div className="footer">
      <div className="links">
        <a href={config.contact}>Contact Us</a>
        <a target="_blank" href={config.terms} rel="noopener noreferrer">Terms & Conditions</a>
        <a target="_blank" href={config.privacy} rel="noopener noreferrer">Privacy Policy</a>
      </div>
    </div>
  );
}

Footer.propTypes = {
  config: types.shape({
    contact: types.string.isRequired,
    terms: types.string.isRequired,
    privacy: types.string.isRequired,
  }).isRequired,
};
