const React = require('react');
import GoogleLogin from 'react-google-login';
const types = React.PropTypes;

class GoogleLoginWrapper extends React.Component {
  static propTypes = {
      onSuccess: types.func.isRequired,
      onFailure: types.func.isRequired,
      className: types.string
  };

  constructor(props, context) {
    super(props, context);
    this.handleClickCapture = this.handleClickCapture.bind(this);
  }

  handleClickCapture(event) {
    if (global.Retro.config.mock_google_auth) {
      event.stopPropagation();
      this.props.onSuccess({
        profileObj: {
          email: 'my-email@example.com',
          name: 'my full name'
        },
        accessToken: window.mock_google_auth
      });
    }
  }

  render() {
    return (
      <div onClickCapture={this.handleClickCapture}>
        <GoogleLogin
          clientId={global.Retro.config.google_oauth_client_id}
          onSuccess={this.props.onSuccess}
          onFailure={this.props.onFailure}
          className={'button start-retro ' + this.props.className}
          hostedDomain={global.Retro.config.google_oauth_hosted_domain}
        >
          <span><i className="fa fa-google" aria-hidden="true" style={{marginRight: '10px'}}/>Sign in with Google</span>
        </GoogleLogin>
      </div>
    );
  }
}

module.exports = GoogleLoginWrapper;
