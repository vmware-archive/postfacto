const invariant = require('invariant');
const React = require('react');
const ReactDOM = require('react-dom');

module.exports = {
  init(Entry, props = {}) {
    if (typeof document === 'undefined') return;
    require('./stylesheets/application.scss');
    require('babel!pui-react-tools/assets/entry-loader?name=index.html!./components/application');
    invariant(global.Retro,
      `globalNamespace in application.json has been changed without updating global variable name bootstrap.js.
      Please change "Retro" in bootstrap.js to your current globalNamespace`
    );
    const {config} = global.Retro;
    ReactDOM.render(<Entry {...props} {...{config}}/>, root);
  }
};


