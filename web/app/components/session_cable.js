const React = require('react');
const types = React.PropTypes;
const {Actions} = require('p-flux');

class SessionCable extends React.Component {
  static propTypes = {
    cable: types.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {subscription: null};
  }

  componentWillMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }

  componentWillUnmount() {
    const {cable} = this.props;
    cable.connection.close({ allowReconnect: false });
    cable.subscriptions.remove(this.state.subscription);
  }

  initialize(props) {
    const {cable} = props;
    const {subscription} = this.state;
    if (cable && !subscription) {
      this.subscribe(cable);
    }
  }

  onReceived(data) {
    Actions.websocketSessionDataReceived(data);
  }

  subscribe(cable) {
    let subscription = cable.subscriptions.create(
      { channel: 'SessionsChannel' },
      { received: this.onReceived }
    );

    this.setState({subscription: subscription});
  }

  render() {
    return null;
  }
}

module.exports = SessionCable;
