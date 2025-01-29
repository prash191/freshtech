import 'bable-poiyflii';
import { displayMap } from './mapbox';
import { login } from './login';
import { logout } from './login';
import { updateSettings } from './updateSettings';

// DOM Elements
const loginForm = document.querySelector('.form--login');
const mapBox = document.getElementById('map');
const logOutBtn = document.querySelector('.nav__el--logout');
const accountUpdateForm = document.querySelector('.form-user-data');
const passwordUpdateForm = document.querySelector('.form-user-settings');


if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if(logOutBtn) {
    logOutBtn.addEventListener('click', (e) => {
        logout();
    })
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (accountUpdateForm) {
  accountUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let form = new FormData();
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (passwordUpdateForm) {
  passwordUpdateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    document.querySelector('.btn--update-password').innerHTML = 'UPDATING PASSWORD...';
    await updateSettings({password: currentPassword, newPassword: newPassword, passwordConfirm: passwordConfirm}, 'password');
    document.querySelector('.btn--update-password').innerHTML = 'SAVE PASSWORD';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
