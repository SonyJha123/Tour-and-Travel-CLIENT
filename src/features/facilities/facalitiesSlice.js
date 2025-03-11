import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = process.env.REACT_APP_API_URL;
const updateHotelApi =process.env.REACT_APP_HOTEL_UPDATE_API_FACILITIES;

export const updateFacilities = createAsyncThunk(
    'facilities/updateFacilities',
    async ({ hotelId, facilitiesData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendURL}${updateHotelApi}/${hotelId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(facilitiesData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message);
            }

            const data = await response.json();
            
            return data;
        } catch (error) {
            return rejectWithValue('An error occurred while updating facilities.');
        }
    }
);

const facilitiesSlice = createSlice({
    name: 'facilities',
    initialState: {
        loading: false,
        error: null,
    },
    reducers: {
        resetFacilitiesState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateFacilities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFacilities.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateFacilities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetFacilitiesState } = facilitiesSlice.actions;

export default facilitiesSlice.reducer;