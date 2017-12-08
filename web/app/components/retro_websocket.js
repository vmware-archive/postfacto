const React = require('react');
const types = React.PropTypes;
const RetroCable = require('./retro_cable');

class RetroWebsocket extends React.Component {
  static propTypes = {
    url: types.string.isRequired,
    retro_id: types.string,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {cable: null};
  }

  componentWillMount() {
    this.initialize(this.props);
  }
  
  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }
  
  initialize(props) {
    const {cable} = this.state;
    const {url} = props;
    if (!cable) {
      this.createCable(url);
    }
  }

  createCable(url) {
    const ActionCable = require('actioncable');
    let cable = ActionCable.createConsumer(url);
    this.setState({cable: cable});
  }

  renderCable() {
    const {cable} = this.state;
    const {retro_id} = this.props;
    if (cable) {
      return <RetroCable cable={cable} retro_id={retro_id}/>;
    }
    return null;
  }

  render() {
    return(
      this.renderCable()
    );
  }
}

module.exports = RetroWebsocket;
