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

import {Component} from 'react';
import PropTypes from 'prop-types';
import Giphy from '../../helpers/giphy';

export default class GiphyText extends Component {
  static propTypes = {
    retroId: PropTypes.string.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    value: '',
  };

  constructor(props) {
    super(props);
    this.state = {processed: ''};
  }

  async componentDidMount() {
    const {retroId, value} = this.props;
    this.setState({processed: value});
    try {
      const giphy = new Giphy(retroId);
      const processed = await giphy.interpolate(value);
      this.setState(() => ({processed}));
    } catch {
      // ignore
    }
  }

  async componentWillReceiveProps(nextProps) {
    const {retroId, value} = nextProps;
    this.setState({processed: value});
    try {
      const giphy = new Giphy(retroId);
      const processed = await giphy.interpolate(value);
      this.setState(() => ({processed}));
    } catch {
      // ignore
    }
  }

  render() {
    const {processed} = this.state;
    return processed;
  }
}
