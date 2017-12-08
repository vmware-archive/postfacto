const React = require('react');
const {Actions} = require('p-flux');

import { RaisedButton } from 'material-ui';


const RetroFooter = require('../footer');
const RetroTile = require('../pure/retro_tile');
const types = React.PropTypes;

class ListRetrosPage extends React.Component {

  static propTypes = {
    retros: types.array,
  };

  componentWillMount() {
    Actions.getRetros();
  }

  handleRetroListItemClicked() {
    const retro = this;
    Actions.routeToShowRetro(retro);
  }

  handleNewRetroButtonClicked() {
    Actions.routeToNewRetro();
  }

  handleSingOutButtonClicked() {
    Actions.signOut();
  }

  render() {
    const retroListItems = this.props.retros.map((retro, index) => {
      return <RetroTile key={index} callback={this.handleRetroListItemClicked.bind(retro)} retro={retro}>{retro.name}</RetroTile>
    });
    return (
      <div className="list-retros-page full-height">
        <div className="retro-heading">
          <span className="retro-heading-content">
            <div className="retro-name">
              <h1>My Retros</h1>
            </div>
            <div className="retro-heading-buttons">
              <RaisedButton
                className="new-retro"
                backgroundColor="#2574a9"
                labelColor="#f8f8f8"
                label="NEW RETRO"
                onClick={this.handleNewRetroButtonClicked.bind(this)}
              />

              <RaisedButton
                className="sign-out"
                backgroundColor="#2574a9"
                labelColor="#f8f8f8"
                label="SIGN OUT"
                onClick={this.handleSingOutButtonClicked.bind(this)}
              />
            </div>
          </span>
        </div>

        <div className="retro-tiles-container">
          <div className="retro-tiles">
          {retroListItems}
        </div>

        </div>

        <RetroFooter/>
      </div>
  );
  }
}

module.exports = ListRetrosPage;