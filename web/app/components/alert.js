const React = require('react');
const {Actions} = require('p-flux');
const types = React.PropTypes;

const DEFAULT_DURATION = 3500;
class Alert extends React.Component {
  static propTypes = {
    alert: types.shape({
      checkIcon: types.bool,
    }),
  };

  componentDidMount() {
    this.initialize(this.props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.alert !== nextProps.alert;
  }

  componentDidUpdate() {
    this.initialize(this.props);
  }

  startHideTimer(duration = DEFAULT_DURATION) {
    this.timeout = setTimeout(Actions.hideAlert, duration);
  }

  initialize(props) {
    const {alert} = props;

    if (alert && (alert.message && alert.message.length > 0) && !alert.sticky) {
      this.startHideTimer(alert.duration);
    } else if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  renderIcon() {
    if (this.props.alert.checkIcon) {
      return <i className="alert__icon fa fa-check"/>;
    }
  }

  render() {
    const {alert, className} = this.props;

    if (alert && (alert.message && alert.message.length > 0)) {
      return (
        <div className={`alert ${className ? className : ''}`}>
          { this.renderIcon() }
          <span className="alert__text">{alert.message}</span>
          <span className="alert__link" onClick={alert.linkClick}>{alert.linkMessage}</span>
        </div>
      );
    }

    return null;
  }
}
module.exports = Alert;
