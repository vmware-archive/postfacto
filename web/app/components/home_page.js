const React = require('react');
const {Actions} = require('p-flux');
const RetroFooter = require('./footer');
const GoogleLoginWrapper = require('./google_login_wrapper.js');
const Testimonial = require('./testimonial');
const Logger = require('../../helpers/logger');
import {HomeLegalBanner} from './retro_legal_banner';

class HomePage extends React.Component {
  componentDidMount() {
    Actions.showHomePageAnalytics();
  }

  onSignIn(googleUser) {
    Logger.info('onGoogleSignIn ' + googleUser.profileObj.email);
    Actions.createSession({access_token: googleUser.accessToken, email: googleUser.profileObj.email, name: googleUser.profileObj.name});
  }

  onGoogleLoginFailure() {
    Logger.info('onGoogleLoginFailure');
  }

  isInEU(countryCode) {
    return ['AT', 'BE', 'BG', 'HR', 'CZ', 'CY', 'DK', 'EE', 'FI', 'FR', 'DE', 'EL', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'SK', 'SI', 'ES', 'SE', 'GB', 'UK'].includes(countryCode);
  }

  render() {
    return (
      <div className="home-page">
        <div className="sticky-header">
          <div className="row">
            {
              this.isInEU(this.props.countryCode) ? <HomeLegalBanner /> : null
            }
          </div>
          <div className="row header-title">
            <div className="show-for-medium small-12 columns">
              <span className="title">postfacto</span>
              <span className="subtitle">A retro app for successful teams.</span>
            </div>
            <div className="hide-for-medium small-12 columns text-center">
              <span className="title small-12 columns">postfacto</span>
              <span className="subtitle">A retro app for successful teams.</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="row" style={{paddingTop: '77px'}}>
            <div className="text-block columns">
              <h2>Postfacto helps you run better retrospectives.</h2>
            </div>
          </div>
          <div className="row">
            <div className="text-center">
              {
                global.Retro.config.google_oauth_client_id ? <GoogleLoginWrapper
                  onSuccess={this.onSignIn}
                  onFailure={this.onGoogleLoginFailure}
                  className="top-start-retro"
                /> : null
              }
            </div>
          </div>
          <div className="row">
            <div className="text-center whats-a-retro-link">
              <a href="https://builttoadapt.io/how-to-run-a-really-good-retrospective-8982bd839e16" target="_blank">What's a retro?</a>
            </div>
          </div>
        </div>

        <RetroFooter/>
      </div>
    );
  }
}

module.exports = HomePage;
