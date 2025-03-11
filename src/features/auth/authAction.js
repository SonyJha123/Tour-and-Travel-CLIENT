import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
    registerRequest, 
    registerSuccess, 
    registerFailure,
    loginRequest,
    loginSuccess,
    loginFailure
} from './authSlice';

const backendURL = process.env.REACT_APP_API_URL;

// Registration action
export const registerUser  = createAsyncThunk(
    'auth/register',
    async (userData, { dispatch }) => {
        dispatch(registerRequest()); 
        try {
            const response = await axios.post(`${backendURL}/api/user/register`, userData);
            dispatch(registerSuccess(response.data)); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(registerFailure(errorMessage)); 
        }
    }
);

// Login action
export const loginUser  = createAsyncThunk(
    'auth/login',
    async (userData, { dispatch }) => {
        dispatch(loginRequest()); 
        try {
            const response = await axios.post(`${backendURL}/api/user/login`, userData);
            dispatch(loginSuccess(response.data)); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(loginFailure(errorMessage)); 
        }
    }
);