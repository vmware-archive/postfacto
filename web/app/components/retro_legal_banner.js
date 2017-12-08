const React = require('react');
const types = React.PropTypes;

class LegalBanner extends React.Component {

  okClicked() {

  }

  shouldHide() {
    return true;
  }

  render() {
    if (this.shouldHide()) {
      return null;
    } else {
      return (
        <div className="banner" style={{display: 'flex'}}>
          <div className="terms-text">
            By accessing and using Postfacto, you agree to our <a href={global.Retro.config.terms} target="_blank">Terms of Use</a> and <a href={global.Retro.config.privacy} target="_blank">Privacy Policy</a> and use of cookies
          </div>
          <button className="button ok-button" onClick={this.okClicked.bind(this)}>OK</button>
        </div>
      );
    }
  }
}

class RetroLegalBanner extends LegalBanner {

  static propTypes = {
    retro: types.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasBeenDismissed: this.hasBeenDismissed(props.retro)
    };
  }

  okClicked() {
    super.okClicked();

    this.markAsDismissed(this.props.retro);

    this.setState({
      hasBeenDismissed: true
    });
  }

  shouldHide() {
    return this.state.hasBeenDismissed || this.props.retro.is_private;
  }

  markAsDismissed(retro) {
    let retroBannersDismissed = JSON.parse(window.localStorage.retroBannersDismissed);
    retroBannersDismissed.push(retro.id);
    window.localStorage.retroBannersDismissed = JSON.stringify(retroBannersDismissed);
  }

  hasBeenDismissed(retro) {
    if (!window.localStorage.retroBannersDismissed) {
      window.localStorage.retroBannersDismissed = JSON.stringify([]);
    }

    return JSON.parse(window.localStorage.retroBannersDismissed).includes(retro.id);
  }
}

class HomeLegalBanner extends LegalBanner {

  constructor(props, context) {
    super(props, context);
    this.state = {
      hasBeenDismissed: window.localStorage.homeTermsDismissed
    };
  }

  okClicked() {
    super.okClicked();

    window.localStorage.homeTermsDismissed = true;

    this.setState({ hasBeenDismissed: true });
  }

  shouldHide() {
    return this.state.hasBeenDismissed;
  }
}

export {RetroLegalBanner, HomeLegalBanner};
