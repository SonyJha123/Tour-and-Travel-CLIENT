import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const backendURL = process.env.REACT_APP_API_URL;
const hotelApi =process.env.REACT_APP_HOTEL_CREATE_API;
export const createHotel = createAsyncThunk(
    'hotel/createHotel',
    async (hotelData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendURL}${hotelApi}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(hotelData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue('An error occurred while creating the hotel.');
        }
    }
);

const hotelSlice = createSlice({
    name: 'hotel',
    initialState: {
        basicInformation: {},
        contactInformation: {},
        loading: false,
        error: null,
    },
    reducers: {
        setBasicInformation: (state, action) => {
            state.basicInformation = action.payload;
        },
        setContactInformation: (state, action) => {
            state.contactInformation = action.payload;
        },
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(createHotel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createHotel.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createHotel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setBasicInformation, setContactInformation } = hotelSlice.actions;

export default hotelSlice.reducer;