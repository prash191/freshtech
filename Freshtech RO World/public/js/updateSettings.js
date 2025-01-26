import axios from 'axios'
import { showAlerts } from './alert';

export const updateSettings = async (data, type) => {
    const usersEndpoint = 'http://localhost:3000/api/v1.0/users';
    const url = type === 'password' ? usersEndpoint + '/updatePassword' : usersEndpoint + '/updateMe'
    try{
        let res = await axios({
            method: 'PATCH',
            url: url,
            data
        });

        if(res.data.status === 'success') {
            showAlerts('success', `Account ${type[0].toUpperCase() + type.slice(1)} successfully updated.`);
        }
    } catch(err) {
        showAlerts('error', 'Error while updating the details.');
    }
}