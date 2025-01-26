import axios from 'axios'
import { showAlerts } from './alert';

export const login = async (email, password) => {
    try {
        let res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1.0/users/login',
            data: {
                email,
                password
            }
        })
        if(res.data.status === 'success') {
            showAlerts('success', 'You are now logged in.')
            window.setTimeout(()=>{
                window.location = '/';
            }, 1500);
        }
    } catch(err) {
        showAlerts('error', err.response.data.message);
    }
}

export const logout = async () => {
    try {
        let res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1.0/users/logout',
        })
        console.log(res);
        if(res.data.status === 'success') location.reload(true);
    } catch(err) {
        showAlerts('error', err.response.data.message);
    }
}