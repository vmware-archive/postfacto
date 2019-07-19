const ArchiveMiddleware = (actionDispatcher) => (store) => (next) => (action) => {
  if (action.type === 'CURRENT_RETRO_ITEM_DONE_UPDATED') {
    const {itemId, done} = action.payload;

    let allDone = false;

    if (done) {
      const currentRetro = store.getState().retro.currentRetro;
      allDone = currentRetro.items
        .filter((item) => item.id !== itemId)
        .every((i) => i.done);

      const item = currentRetro.items.find((i) => i.id === itemId);
      actionDispatcher.completedRetroItemAnalytics({data: {retroId: currentRetro.id, category: item.category}});
    }

    if (allDone) {
      store.dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          title: 'Archive this retro?',
          message: 'The board will be cleared ready for your next retro and incomplete action items will be carried across.',
        },
      });
    }
  }
  next(action);
};

export default ArchiveMiddleware;
