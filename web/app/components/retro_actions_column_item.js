const React = require('react');
const types = React.PropTypes;
const {Actions} = require('p-flux');
const RetroItemEditView = require('./retro_item_edit_view');

class RetroActionsColumnItem extends React.Component {
  static propTypes = {
    retro: types.object.isRequired,
    retroId: types.string.isRequired,
    action_item: types.object.isRequired,
    archives: types.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
  }

  renderTick() {
    const {action_item} = this.props;

    let tick = action_item.done ?
      <img className="action-tick-checked" src={require('../images/action-tick-checked.svg')}/>
      : <img className="action-tick-unchecked" src={require('../images/action-tick-unchecked.svg')}/>;
    return (
      <div className="action-tick" onClick={this.onActionTickClicked.bind(this)}>
        {tick}
      </div>
    );
  }

  renderEditButton() {
    const {archives} = this.props;
    if (archives) {
      return null;
    }
    return (
      <div className="action-edit" onClick={this.onActionEditClicked.bind(this)}>
        <i className="fa fa-pencil"/>
      </div>
    );
  }

  onActionTickClicked() {
    const {retroId, action_item} = this.props;
    Actions.doneRetroActionItem({retro_id: retroId, action_item_id: action_item.id, done: !action_item.done});
  }

  onActionEditClicked() {
    const {action_item} = this.props;
    this.setState({isEditing: true, editedText: action_item.description});
  }

  deleteItem() {
    const {retroId, action_item} = this.props;
    Actions.deleteRetroActionItem({retro_id: retroId, action_item: action_item});
  }

  saveActionItem(editedText) {
    const {retroId, action_item} = this.props;

    this.setState({isEditing: false});
    Actions.editRetroActionItem({retro_id: retroId, action_item_id: action_item.id, description: editedText});
  }

  render() {
    let actionContent;
    if (this.state.isEditing) {
      actionContent = (
        <RetroItemEditView
          originalText={this.props.action_item.description}
          deleteItem={this.deleteItem.bind(this)}
          saveItem={this.saveActionItem.bind(this)}
        />
      );
    } else {
      actionContent = (
        <div className="action-content">
          { this.renderTick() }
          <div className="action-text">
            {this.props.action_item.description}
          </div>
          { this.renderEditButton() }
        </div>
      );
    }

    return (
      <div className={`retro-action ${this.state.isEditing ? 'retro-action-edit' : '' }`}>
        { actionContent }
      </div>
    );
  }
}

module.exports = RetroActionsColumnItem;
