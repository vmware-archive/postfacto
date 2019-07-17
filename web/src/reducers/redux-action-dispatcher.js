
export function currentRetroUpdated(retro) {
  return {
    type: 'CURRENT_RETRO_UPDATED',
    payload: retro,
  };
}

export function currentRetroItemUpdated(item) {
  return {
    type: 'CURRENT_RETRO_ITEM_UPDATED',
    payload: item,
  };
}


export function currentRetroActionItemUpdated(actionItem) {
  return {
    type: 'CURRENT_RETRO_ACTION_ITEM_UPDATED',
    payload: actionItem,
  };
}

export function currentRetroActionItemDeleted(actionItem) {
  return {
    type: 'CURRENT_RETRO_ACTION_ITEM_DELETED',
    payload: actionItem,
  };
}

export function currentRetroItemDeleted(item) {
  return {
    type: 'CURRENT_RETRO_ITEM_DELETED',
    payload: item,
  };
}

export function currentRetroItemDoneUpdated(itemId, done) {
  return {
    type: 'CURRENT_RETRO_ITEM_DONE_UPDATED',
    payload: {itemId, done},
  };
}


export function currentRetroSendArchiveEmailUpdated(status) {
  return {
    type: 'CURRENT_RETRO_SEND_ARCHIVE_EMAIL_UPDATED',
    payload: status,
  };
}

export function currentRetroHighlightCleared() {
  return {
    type: 'CURRENT_RETRO_HIGHLIGHT_CLEARED',
  };
}

export function retrosUpdated(retros) {
  return {
    type: 'RETROS_UPDATED',
    payload: retros,
  };
}

export function errorsUpdated(errors) {
  return {
    type: 'ERRORS_UPDATED',
    payload: errors,
  };
}

export function clearErrors() {
  return {
    type: 'CLEAR_ERRORS',
  };
}
