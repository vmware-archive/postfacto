const React = require('react');
const types = React.PropTypes;

class RetroTile extends React.Component {

  static propTypes = {
    retro: types.object,
    callback: types.func,
  };

  render() {
    return <div className='retro-list-tile' onClick={this.props.callback}>{this.props.retro.name}</div>;
  }
}

module.exports = RetroTile;