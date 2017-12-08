const React = require('react');
const types = React.PropTypes;
import Helmet from 'react-helmet';

class Header extends React.Component {
  static propTypes = {
    retro: types.object,
    config: types.object,
  };

  render() {
    const {config, retro} = this.props;
    let documentTitle = retro.name.length > 0 ? retro.name + ' - ' + config.title : config.title;
    return (
      <Helmet title={documentTitle}
              link={[{'rel': 'icon',
              'href': '/images/favicon.png?v=2'}]}/> // bump version when you update favicon.png
    );
  }
}

module.exports = Header;
