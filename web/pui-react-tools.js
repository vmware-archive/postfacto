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

var _require = require('pui-react-tools/webpack/webpack.plugins.js');

var extractCss = _require.extractCss;
var extractSass = _require.extractSass;

module.exports = {
  webpack: {
    development: {
      module: {
        loaders: [{
          test: [/\.png(\?|$)/, /\.gif(\?|$)/, /\.eot(\?|$)/, /\.ttf(\?|$)/, /\.woff2?(\?|$)/, /\.jpe?g(\?|$)/], loader: 'url' },
          { test: [/\.svg(\?|$)/], loader: 'url' },
          { test: /\.css$/, exclude: /typography/, loaders: ['style', 'css?sourceMap'] },
          { test: /\.css$/, include: /typography/, loaders: ['style', 'css'] },
          { test: /\.scss$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap'] },
          { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] }]
      },
    },
    test: {
      module: {
        loaders: [
          { test: [/\.png(\?|$)/, /\.gif(\?|$)/, /\.eot(\?|$)/, /\.ttf(\?|$)/, /\.woff2?(\?|$)/, /\.jpe?g(\?|$)/], loader: 'url' },
          { test: [/\.svg(\?|$)/], loader: 'url' },
          { test: /\.css$/, loader: extractCss.extract('css') },
          { test: /\.scss$/, loader: extractSass.extract(['css?sourceMap', 'sass?sourceMap']) },
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel?sourceMaps=true' }]
      },
    },
    acceptance: {
      module: {
        loaders: [
          { test: [/\.svg(\?|$)/, /\.eot(\?|$)/, /\.ttf(\?|$)/, /\.woff2?(\?|$)/, /\.png(\?|$)/, /\.gif(\?|$)/, /\.jpe?g(\?|$)/], loader: 'url' },
          { test: /\.css$/, loader: extractCss.extract('css') }, { test: /\.scss$/, loader: extractSass.extract(['css', 'sass']) },
          { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }]
      },
    },
    production: {
      module: {
        loaders: [
          { test: [/\.svg(\?|$)/, /\.eot(\?|$)/, /\.ttf(\?|$)/, /\.woff2?(\?|$)/, /\.png(\?|$)/, /\.gif(\?|$)/, /\.jpe?g(\?|$)/], loader: 'url' },
          { test: /\.css$/, loader: extractCss.extract('css') }, { test: /\.scss$/, loader: extractSass.extract(['css', 'sass']) },
          { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }]
      },
    },
    integration: {
      devtool: 'source-map'
    }
  }
};
