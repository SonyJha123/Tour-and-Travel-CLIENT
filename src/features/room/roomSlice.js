import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = process.env.REACT_APP_API_URL;
const roomApi = process.env.REACT_APP_ROOM_CREATE_API;
export const createRoom = createAsyncThunk(
    'room/createRoom',
    async (formData, { rejectWithValue }) => {
        try {
          const form = new FormData();
      
          form.append("totalNumberOfRooms", String(formData.totalNumberOfRooms));
          form.append("roomType", formData.roomType);
          form.append("roomCountandCapacity", formData.roomCountandCapacity);
          form.append("mealType", formData.mealType);
          form.append("pricing", formData.pricing);
          form.append("roomAmenities", formData.roomAmenities);
          form.append("blackoutdatePricing", formData.blackoutdatePricing);
          form.append("supplements", formData.supplements);
          form.append("hotelId", formData.hotelId);
      
          if (formData.roomImages) {
            Object.entries(formData.roomImages).forEach(([roomType, files]) => {
              files.forEach((file, index) => {
                form.append(`roomImages[${roomType}]`, file);
              });
            });
          }
      
          // Send request
          const response = await fetch(`${backendURL}${roomApi}/${formData.hotelId}`, {
            method: "POST",
            body: form,
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData.message || "Unknown error");
          }
      
          return await response.json();
      
        } catch (error) {
          return rejectWithValue(error.message || "Failed to create room");
        }
    }
)



const roomSlice = createSlice({
    name: 'room',
    initialState: {
        roomData: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetRoomState: (state) => {
            state.roomData = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.roomData.push(action.payload);
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetRoomState } = roomSlice.actions;

export default roomSlice.reducer;