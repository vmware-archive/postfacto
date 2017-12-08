const React = require('react');
const {Actions} = require('p-flux');

class NotFoundPage extends React.Component {

  componentWillUnmount() {
    Actions.resetNotFound();
  }

  onCreateNewRetroClicked() {
    Actions.redirectToRetroCreatePage();
  }

  render() {
    return (
      <div className="error-page">
        <div className="row" style={{marginTop:'180px'}}>
          <div className="small-centered medium-8 small-10 columns">
            <h1>Oops... Looks like the page you're looking for doesn't exist.</h1>
            <p>Perhaps you were trying to do this?</p>
            <div className="row">
              <button className="retro-form-submit expanded button" style={{fontSize: '1.1rem'}}
                      onClick={this.onCreateNewRetroClicked.bind(this)}>Create a Project
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = NotFoundPage;
