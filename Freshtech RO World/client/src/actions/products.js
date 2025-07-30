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

export const getProductById =  async (method, endpoint) => {
    try {
        let res = await axios({
            method: method,
            url: endpoint,
            withCredentials: true
        });
        console.log(res);
        return res;
    } catch(err) {
        console.log(err);
    }
}

export const createProduct = async function(method, endpoint, headers, data) {
    try {
        let res = await axios({
            method: method,
            url: endpoint,
            headers: headers,
            data,
            withCredentials: true
        });
        console.log(res);
        
        return res;
    } catch(err) {
        console.log(err);
    }
}


export const deleteProductById = async function(method, endpoint) {
    try {
        let res = await axios({
            method: method,
            url: endpoint,
            withCredentials: true
        });
        console.log(res);
        
        return res;
    } catch(err) {
        console.log(err);
    }
}