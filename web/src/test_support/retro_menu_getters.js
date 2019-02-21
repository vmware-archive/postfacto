import RetroMenu from '../components/shared/retro_menu';

export function getMenuItems(dom) {
  return dom.find(RetroMenu).props().items;
}

export function getMenuLabels(dom) {
  return getMenuItems(dom).map((item) => item.title);
}

export function invokeMenuOption(dom, label) {
  const item = getMenuItems(dom).filter((i) => (i.title === label))[0];
  if (!item) {
    throw new Error(`Failed to find menu item ${label}`);
  }
  item.callback();
}
