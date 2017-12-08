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
