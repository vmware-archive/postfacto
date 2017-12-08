const React = require('react');
const types = React.PropTypes;
const {Actions} = require('p-flux');
const Logger = require('../../helpers/logger');

class RetroCable extends React.Component {
  static propTypes = {
    cable: types.object,
    retro_id: types.string.isRequired,
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
    const {cable, retro_id} = props;
    const {subscription} = this.state;
    if (cable && !subscription) {
      this.subscribe(cable, retro_id, localStorage.getItem('apiToken-' + retro_id));
    }
  }

  onReceived(data) {
    Actions.websocketRetroDataReceived(data);
  }

  onDisconnected(data) {
    Logger.info('disconnected from actioncable', data);
  }

  subscribe(cable, retro_id, api_token) {
    let subscription = cable.subscriptions.create(
      {channel: 'RetrosChannel', retro_id: retro_id, api_token: api_token},
      {
        received: this.onReceived,
        disconnected: this.onDisconnected,
        connected: this.onConnected
      });

    this.setState({subscription: subscription});
  }

  render() {
    return null;
  }
}

module.exports = RetroCable;
