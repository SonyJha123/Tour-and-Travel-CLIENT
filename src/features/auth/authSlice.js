import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        error: null,
        loading: false,
    },
    reducers: {
        loginRequest: (state) => {
            state.loading = true; 
            state.error = null; 
        },
        loginSuccess: (state, action) => {
            state.loading = false; 
            state.isAuthenticated = true; 
            state.user = action.payload; 
            state.error = null; 
        },
        loginFailure: (state, action) => {
            state.loading = false; 
            state.error = action.payload; 
        },
        registerRequest: (state) => {
            state.loading = true; 
            state.error = null; 
        },
        registerSuccess: (state, action) => {
            state.loading = false; 
            state.isAuthenticated = true; 
            state.user = action.payload; 
            state.error = null; 
        },
        registerFailure: (state, action) => {
            state.loading = false; 
            state.error = action.payload; 
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
        setError: (state, action) => {
            state.error = action.payload; 
        },
    },
});

export const { 
    loginRequest, 
    loginSuccess, 
    loginFailure, 
    logout, 
    setError, 
    registerRequest, 
    registerSuccess, 
    registerFailure 
} = authSlice.actions;

export default authSlice.reducer;