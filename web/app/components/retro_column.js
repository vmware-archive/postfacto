const React = require('react');
const types = React.PropTypes;
const RetroColumnInput = require('./retro_column_input');
const RetroColumnItem = require('./retro_column_item');

class RetroColumn extends React.Component {
  static propTypes = {
    category: types.string.isRequired,
    retro: types.object.isRequired,
    retroId: types.string.isRequired,
    archives: types.bool,
    isMobile: types.bool.isRequired,
  };

  renderRetroItems() {
    const {archives, retroId, retro: {items, highlighted_item_id, retro_item_end_time}, category, isMobile} = this.props;
    if (items) {
      return items
        .filter(function (item) {
          return item.category === category;
        })
        .sort(function (a, b) {
          return b.created_at <= a.created_at ? -1 : 1;
        })
        .map(function (item) {
          return (
            <RetroColumnItem key={item.id} retroId={retroId} item={item} highlighted_item_id={highlighted_item_id}
                             retro_item_end_time={retro_item_end_time} archives={archives} isMobile={isMobile}/>
          );
        });
    }
  }

  renderColumnHeader() {
    const {category, isMobile} = this.props;
    if (isMobile) {
      return null;
    }
    return (
      <div className="retro-item-list-header">
        <img src={require('../images/' + category + '.svg')}/>
      </div>
    );
  }

  renderInput() {
    const {category, retro, retroId, archives} = this.props;
    if (archives) {
      return null;
    }
    return <RetroColumnInput retro={retro} retroId={retroId} category={category}/>;
  }

  render() {
    const {category} = this.props;
    return (
      <div className={'column-' + category}>
        {
          this.renderColumnHeader()
        }
        {
          this.renderInput()
        }
        {
          this.renderRetroItems()
        }
      </div>
    );
  }
}

module.exports = RetroColumn;
