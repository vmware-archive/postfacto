const React = require('react');
const {Actions} = require('p-flux');

class ApiServerNotFoundPage extends React.Component {

  componentWillUnmount() {
    Actions.resetApiServerNotFound();
  }

  render() {
    return (
      <div className="error-page">
        <div className="row" style={{marginTop:'180px'}}>
          <div className="small-centered medium-8 small-10 columns">
            <div className="image">
              <img src={require('../images/face-dead.svg')}/>
            </div>
            <h1>Oh no! It's broken</h1>
            <p>Try refreshing the page, or come back later.</p>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ApiServerNotFoundPage;
