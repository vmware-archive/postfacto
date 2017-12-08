const React = require('react');
const types = React.PropTypes;
const RetroActionsColumn = require('./retro_actions_column');
const RetroColumnInput = require('./retro_column_input');

class RetroActionPanel extends React.Component {
  static propTypes = {
    retro: types.object,
    retroId: types.string.isRequired,
    isMobile: types.bool.isRequired,
    archives: types.bool.isRequired,
  };

  renderActionColumnTitle() {
    const {isMobile} = this.props;
    if (isMobile) {
      return null;
    }
    return <h2>Action items</h2>;
  }

  renderInput() {
    const {retro, retroId, archives} = this.props;
    if (archives) {
      return null;
    }
    return (<RetroColumnInput retro={retro} retroId={retroId} category="action"/>);
  }

  render() {
    const {retro, retroId, isMobile, archives} = this.props;

    return (
      <div className={isMobile ? 'column-action' : 'retro-action-panel'}>
        <div className="retro-action-header">
          {
            this.renderActionColumnTitle()
          }
          {
            this.renderInput()
          }
        </div>
        <div className="retro-action-list">
          <RetroActionsColumn category="current" retro={retro} retroId={retroId} archives={archives}/>
          <RetroActionsColumn category="last-week" retro={retro} retroId={retroId} archives={archives}/>
          <RetroActionsColumn category="older" retro={retro} retroId={retroId} archives={archives}/>
        </div>
      </div>
    );
  }
}

module.exports = RetroActionPanel;
