import axios from "axios"

export const fetchProducts = async function(method, endpoint) {
    try {
        let res = await axios({
            method: method,
            url: endpoint
        });
        console.log(res);
        
        return res;
    } catch(err) {
        console.log(err);
    }
}