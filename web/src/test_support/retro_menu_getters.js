import RetroMenu from '../components/shared/retro_menu';

export function getMenuItems(dom) {
  return dom.find(RetroMenu).props().items;
}

export function getMenuLabels(dom) {
  return getMenuItems(dom).map((i) => i.title);
}

export function invokeMenuOption(dom, label) {
  const items = getMenuItems(dom);
  const item = items.filter((i) => (i.title === label))[0];
  if (!item) {
    const all = items.map((i) => `'${i.title}'`);
    throw new Error(`Failed to find menu item '${label}' (saw ${all.join(', ')})`);
  }
  item.callback();
}
