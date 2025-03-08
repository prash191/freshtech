import * as api from '../api';
import { AUTH } from '../constants/actionTypes'

export const auth = (formData, navigate, isSignUp) => async (dispatch) => {
    try {
        const { data } = isSignUp ? await api.signUp(formData) : await api.signIn(formData);

        console.log('data: ', data);

        dispatch({type: AUTH, data});
        navigate('/');
    }catch(error) {
        console.log("Error while signing In.", error);
    }
}
