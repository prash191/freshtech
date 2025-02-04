import axios from "axios"

export const login = async function(method, endpoint, data) {
    try {
        let res = await axios({
            method: method,
            url: endpoint,
            data,
            withCredentials: true
        });        
        return res;
    } catch(err) {
        console.log(err);
    }
}