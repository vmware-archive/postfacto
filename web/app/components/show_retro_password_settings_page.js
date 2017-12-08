import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
const React = require('react');
const types = React.PropTypes;
const {Actions} = require('p-flux');
import RetroMenu from './retro_menu';
const EmptyPage = require('./empty_page');

class ShowRetroPasswordSettingsPage extends React.Component {
  static propTypes = {
    retro: types.object,
    retroId: types.string,
    config: types.object,
    session: types.object,
    alert: types.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isMobile: false,
      current_password: '',
      confirm_new_password: '',
      new_password: '',
      request_uuid: '',
      errors: {
        confirm_new_password: '',
        current_password: ''
      }
    };
  }

  componentWillMount() {
    this.getSettings(this.props);
    this.handleResize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: {
          current_password: nextProps.errors.current_password
        }
      });
    } else {
      this.setState({errors: {}});
    }
  }

  componentWillUnmount() {
    Actions.clearErrors();
  }

  handleResize() {
    this.setState({isMobile: this.getIsMobile()});
  }

  getIsMobile() {
    return window.innerWidth < 640;
  }

  handleBackButtonClicked() {
    const {retroId} = this.props;
    Actions.backPressedFromSettings({retro_id: retroId});
  }

  handleCancelButtonClicked() {
    const {retroId} = this.props;
    Actions.backPressedFromPasswordSettings({retro_id: retroId});
  }

  handleSubmitButtonClicked() {
    let errors = Object.assign({}, this.state.errors);

    if (this.state.new_password !== this.state.confirm_new_password) {
      errors.confirm_new_password = 'Your passwords do not match!';
    } else {
      errors.confirm_new_password = '';

      Actions.updateRetroPassword({
        retro_id: this.props.retroId,
        new_password: this.state.new_password,
        current_password: this.state.current_password,
        request_uuid: this.props.session.request_uuid
      });
    }
    this.setState({ errors });
  }

  handleChange(e) {
    const elementName = e.currentTarget.name;
    const elementValue = e.currentTarget.value;

    this.setState({[elementName]: elementValue});
  }

  // Fetch Retro
  getSettings(props) {
    const {retroId} = props;
    Actions.getRetroSettings({id: retroId});
  }

  // Render
  renderBackButton() {
    const {isMobile} = this.state;
    return (
      <FlatButton
        className="retro-back"
        onClick={this.handleBackButtonClicked.bind(this)}
        label="Back"
        labelStyle={isMobile ? {'display': 'none'} : {}}
        icon={<FontIcon className="fa fa-chevron-left" />}
      />
    );
  }

  renderMobileHeading() {
    const {isMobile} = this.state;
    const {retro} = this.props;
    let menuItems = this.getMenuItems();

    return (
      <div className="retro-settings-heading-mobile">
        {
          this.renderBackButton()
        }
        <div className="retro-name">
          <h1>{retro.name}</h1>
        </div>
        <RetroMenu isMobile={isMobile} items={menuItems}/>
      </div>
    );
  }

  renderDesktopHeading() {
    const {isMobile} = this.state;
    const {retro} = this.props;
    let menuItems = this.getMenuItems();

    return (
      <div className="retro-heading">
        {
          this.renderBackButton()
        }
        <div className="retro-name">
          <h1>{retro.name}</h1>
        </div>
        <RetroMenu isMobile={isMobile} items={menuItems}/>
      </div>
    );
  }

  getMenuItems() {
    let items = [
      {title: 'Sign out', callback: Actions.signOut, isApplicable: window.localStorage.length > 0}
    ];

    return items.filter((item) => {
      return item.isApplicable;
    });
  }

  render() {
    const {retro} = this.props;
    const {isMobile, errors} = this.state;
    const retroContainerClasses = isMobile ? 'full-height mobile-display' : 'full-height';

    if (!(retro && retro.id)) return (<EmptyPage />);

    return (
      <span>
        <div className={retroContainerClasses}>
          {isMobile ? this.renderMobileHeading() : this.renderDesktopHeading()}
          <div>
            <div className="retro-settings-sidebar large-1 medium-1 columns"/>

            <div className="retro-settings large-11 medium-11 columns">
              <div className="medium-8 small-12 columns">
                <div className="row">
                  <h1 className="retro-settings-header">Change password</h1>
                </div>

                <div className="row">
                  <label className="label">Current password</label>
                  <input id="retro_current_password"
                         type="password"
                         name="current_password"
                         onChange={this.handleChange.bind(this)}
                         className={`form-input ${ errors.current_password ? 'input-error' : '' }`}
                         placeholder="Current password"/>
                  <div className="error-message">{errors.current_password}</div>

                  <label className="label">New password</label>
                  <input id="retro_new_password"
                         type="password"
                         name="new_password"
                         onChange={this.handleChange.bind(this)}
                         placeholder="New password"/>

                  <label className="label">Confirm new password</label>
                  <input id="retro_confirm_new_password"
                         type="password"
                         name="confirm_new_password"
                         onChange={this.handleChange.bind(this)}
                         className={`form-input ${ errors.confirm_new_password ? 'input-error' : '' }`}
                         placeholder="New password again"/>
                  <div className="error-message">{errors.confirm_new_password}</div>
                </div>

                <div className="row">
                  <em>Remember to let your team know the new password!</em>
                </div>

                <div className="row actions">
                  <button
                    className="retro-settings-form-submit button"
                    style={{fontSize: '1.1rem'}}
                    onClick={this.handleSubmitButtonClicked.bind(this)}
                  >
                    Save new password
                  </button>
                  <button className="retro-password-settings-cancel button" onClick={this.handleCancelButtonClicked.bind(this)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

module.exports = ShowRetroPasswordSettingsPage;
