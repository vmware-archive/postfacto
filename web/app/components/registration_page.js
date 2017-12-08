const React = require('react');
const types = React.PropTypes;
const {Actions} = require('p-flux');
import ReactDOM from 'react-dom';

class RegistrationPage extends React.Component {
  static propTypes = {
    accessToken: types.string.isRequired,
    email: types.string.isRequired,
    fullName: types.string.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.register = this.register.bind(this);
  }

  register() {
    let companyName = ReactDOM.findDOMNode(this.refs.companyNameInput).value;
    let fullName = ReactDOM.findDOMNode(this.refs.fullNameInput).value;
    Actions.createUser({access_token: this.props.accessToken,
      company_name: companyName,
      full_name: fullName
    });
  }

  render() {
    return (
      <div className="registration-page">
        <div className="medium-6 small-12 columns registration-side-banner new-retro-column">
            <div className="medium-centered small-centered">
              <p>Welcome to Postfacto!</p>
              <h1>Let’s create an account for you!</h1>
            </div>
        </div>

        <div className="medium-6 small-12 columns new-retro-column">
          <div className="medium-centered small-centered" style={{width: '30rem'}}>
            <div className="row">
              <label className="label">Email</label>
              <input value={this.props.email}
                     placeholder="Email"
                     id="email"
                     name="email"
                     type="email"
                     className={'form-input'}
                     disabled="true"/>
            </div>

            <div className="row">
              <label className="label">Full Name</label>
              <input defaultValue={this.props.fullName}
                     ref="fullNameInput"
                     placeholder="Full Name"
                     id="fullName"
                     name="fullName"
                     type="text"
                     className={'form-input'}/>
            </div>

            <div className="row">
              <label className="label">Company Name</label>
              <input ref="companyNameInput"
                     placeholder="Company Name"
                     id="companyName"
                     name="companyName"
                     type="text"
                     className={'form-input'}/>
            </div>

            <div className="row terms-text">
              <p>By continuing, you agree to Postfacto's <a href="/terms" target="_blank">Terms of Use</a> and <a href="/privacy" target="_blank">Privacy Policy</a></p>
            </div>

            <div className="row">
              <div className="medium-6 small-12 columns" style={{paddingLeft: '0', paddingRight: '0'}}>
                <input type="submit" className="retro-form-submit expanded button"
                       id="create_new_retro" value="Next: Make a retro"
                       onClick={this.register.bind(this)}/>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

module.exports = RegistrationPage;
