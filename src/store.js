import { configureStore } from '@reduxjs/toolkit';
import hotelReducer from './features/hotel/hotelSlice'; 
import roomReducer  from './features/hotel/hotelSlice'; 
import facilitiesReducer from './features/facilities/facalitiesSlice';
import authReducer from './features/auth/authSlice';
import themeReducer from './features/theme/themeSlice';

const store = configureStore({
    reducer: {
        hotel: hotelReducer,
        room: roomReducer,
        facilities: facilitiesReducer,
        auth: authReducer,
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(),
    devTools: true,
})

export default store;