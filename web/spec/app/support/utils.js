export const combineElementsContent = (className) => {
  let message = '';
  $(className).map((i, e) => {
    message += e.textContent;
  });
  return message;
};
