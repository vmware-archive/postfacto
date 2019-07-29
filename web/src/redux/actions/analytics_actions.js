const event = (type, data) => ({
  type: 'TRACK_ANALYTICS',
  payload: {
    type,
    data,
  },
});

const createdRetro = (retroId) => event('Created Retro', {'retroId': retroId});
const visitedRetro = (retroId) => event('Retro visited', {'retroId': retroId});
const createdRetroItem = (retroId, category) => event('Created Retro Item', {'retroId': retroId, 'category': category});
const completedRetroItem = (retroId, category) => event('Completed Retro Item', {
  'retroId': retroId,
  'category': category,
});
const createdActionItem = (retroId) => event('Created Action Item', {'retroId': retroId});
const doneActionItem = (retroId) => event('Done Action Item', {'retroId': retroId});
const undoneActionItem = (retroId) => event('Undone Action Item', {'retroId': retroId});
const archivedRetro = (retroId) => event('Archived Retro', {'retroId': retroId});
const homePageShown = () => event('Loaded homepage');

export {
  createdRetro,
  visitedRetro,
  createdRetroItem,
  completedRetroItem,
  createdActionItem,
  doneActionItem,
  undoneActionItem,
  archivedRetro,
  homePageShown,
};
