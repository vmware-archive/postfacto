const initialState = {
  currentRetro: {
    name: '',
    video_link: '',
    items: [],
    action_items: [],
    is_private: false,
    send_archive_email: true,
  },
};

const RetroReducer = (actionDispatcher) => (state = initialState, action) => {
  if (action.type === 'CURRENT_RETRO_UPDATED') {
    return Object.assign({}, state, {currentRetro: action.payload});
  }

  if (action.type === 'CURRENT_RETRO_SEND_ARCHIVE_EMAIL_UPDATED') {
    return Object.assign({}, state, {currentRetro: {...state.currentRetro, send_archive_email: action.payload}});
  }

  if (action.type === 'CURRENT_RETRO_HIGHLIGHT_CLEARED') {
    return Object.assign({}, state, {currentRetro: {...state.currentRetro, highlighted_item_id: null}});
  }

  if (action.type === 'CURRENT_RETRO_ITEM_DELETED') {
    const item = action.payload;
    const updatedItems = state.currentRetro.items.filter((i) => i.id !== item.id);

    return Object.assign({}, state, {currentRetro: {...state.currentRetro, items: updatedItems}});
  }

  if (action.type === 'CURRENT_RETRO_ITEM_UPDATED') {
    const item = action.payload;
    const existingItems = state.currentRetro.items;

    const position = existingItems.findIndex((i) => i.id === item.id);

    const updatedItems = [].concat(existingItems);
    if (position === -1) {
      updatedItems.push(item);
    } else {
      updatedItems[position] = item;
    }

    return Object.assign({}, state, {currentRetro: {...state.currentRetro, items: updatedItems}});
  }

  if (action.type === 'CURRENT_RETRO_ITEM_DONE_UPDATED') {
    const {itemId, done} = action.payload;
    const existingItems = state.currentRetro.items;

    const position = existingItems.findIndex((i) => i.id === itemId);
    const updatedItems = [].concat(existingItems);
    const item = updatedItems[position];
    item.done = done;

    if (updatedItems.every((i) => i.done)) {
      actionDispatcher.showDialog({
        title: 'Archive this retro?',
        message: 'The board will be cleared ready for your next retro and incomplete action items will be carried across.',
      });
    }

    actionDispatcher.completedRetroItemAnalytics({data: {retroId: state.currentRetro.retroId, category: item.category}});

    return Object.assign({}, state, {
      currentRetro: {
        ...state.currentRetro,
        highlighted_item_id: null,
        items: updatedItems,
      },
    });
  }

  if (action.type === 'CURRENT_RETRO_ACTION_ITEM_UPDATED') {
    const actionItem = action.payload;
    const existingActionItems = state.currentRetro.action_items;

    const position = existingActionItems.findIndex((i) => i.id === actionItem.id);

    const updatedItems = [].concat(existingActionItems);
    if (position === -1) {
      updatedItems.push(actionItem);
    } else {
      updatedItems[position] = actionItem;
    }

    return Object.assign({}, state, {currentRetro: {...state.currentRetro, action_items: updatedItems}});
  }

  if (action.type === 'CURRENT_RETRO_ACTION_ITEM_DELETED') {
    const actionItem = action.payload;
    const updatedActionItems = state.currentRetro.action_items.filter((i) => i.id !== actionItem.id);

    return Object.assign({}, state, {currentRetro: {...state.currentRetro, action_items: updatedActionItems}});
  }

  return state;
};

export default RetroReducer;
