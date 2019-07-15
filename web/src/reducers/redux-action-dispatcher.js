
export function retroUpdated(retro) {
  return {
    type: 'RETRO_UPDATED',
    payload: retro,
  };
}

export function retroItemUpdated(item) {
  return {
    type: 'RETRO_ITEM_UPDATED',
    payload: item,
  };
}


export function retroActionItemUpdated(actionItem) {
  return {
    type: 'RETRO_ACTION_ITEM_UPDATED',
    payload: actionItem,
  };
}

export function retroActionItemDeleted(actionItem) {
  return {
    type: 'RETRO_ACTION_ITEM_DELETED',
    payload: actionItem,
  };
}

export function retroItemDeleted(item) {
  return {
    type: 'RETRO_ITEM_DELETED',
    payload: item,
  };
}

export function retroItemDoneUpdated(itemId, done) {
  return {
    type: 'RETRO_ITEM_DONE_UPDATED',
    payload: {itemId, done},
  };
}


export function retroSendArchiveEmailUpdated(status) {
  return {
    type: 'RETRO_SEND_ARCHIVE_EMAIL_UPDATED',
    payload: status,
  };
}

export function retroHighlightCleared() {
  return {
    type: 'RETRO_HIGHLIGHT_CLEARED',
  };
}
