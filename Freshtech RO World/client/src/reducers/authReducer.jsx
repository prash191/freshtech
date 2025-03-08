import { AUTH } from '../constants/actionTypes'

const initialUser = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user : initialUser ? initialUser : null,
    isAuthenticated : !!initialUser,
}

export default ( state = initialState , action ) => {
    switch (action.type ){
        case AUTH:
            console.log('action:', action);
            localStorage.setItem('user', JSON.stringify({ ...action?.data }));
            return { ...state, user: action?.data.user, isAuthenticated : true };
        default:
            return state;
    }
};