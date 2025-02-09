import axios from "axios"

export const auth = async function(method, endpoint, data, headers=null) {
    try {
        let res = await axios({
            method: method,
            url: endpoint,
            data,
            headers,
            withCredentials: true
        });
        return res.data;
    } catch(err) {
        const newError = {status: 'fail', message: ''}
        newError.message = err?.response?.data?.message;
        return newError;
    }
}