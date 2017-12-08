const React = require('react');
const types = React.PropTypes;
const SessionCable = require('./session_cable');

class SessionWebsocket extends React.Component {
  static propTypes = {
    url: types.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {cable: null};
  }

  componentDidMount() {
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
    if (cable) {
      return <SessionCable cable={cable}/>;
    }
    return null;
  }

  render() {
    return(
      this.renderCable()
    );
  }
}

module.exports = SessionWebsocket;
