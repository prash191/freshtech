export const hideAlerts = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlerts = (type, message) => {
  hideAlerts();
  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterBegin', markup);
  window.setTimeout(hideAlerts, 3000);
};
