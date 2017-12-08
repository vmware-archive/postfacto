const React = require('react');
const {Actions} = require('p-flux');

class RetroNotFoundPage extends React.Component {

  componentWillUnmount() {
    Actions.resetRetroNotFound();
  }

  onCreateNewRetroClicked() {
    Actions.redirectToRetroCreatePage();
  }

  render() {
    return (
      <div className="error-page">
        <div className="row" style={{marginTop:'180px'}}>
          <div className="small-centered medium-8 small-10 columns">
            <h1>Project not found.</h1>
            <p>Unfortunately, we couldn't find that project. If you've created a project already, double-check your
              URL.</p>
            <p>If you haven't created a project, why don't you
              create one?</p>
            <div className="row">
              <button className="retro-form-submit expanded button" style={{fontSize: '1.1rem'}} onClick={this.onCreateNewRetroClicked.bind(this)}>Create a Project
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = RetroNotFoundPage;
