import axios from 'axios';
import { BACKEND_API_ENDPOINT } from '../constants/constant';

const API = axios.create({ 
    baseURL: BACKEND_API_ENDPOINT,
    withCredentials: true,
 });

export const signIn = (formData) => API.post(`/users/login`, formData);
export const signUp = (formData) => API.post(`/users/signup`, formData);