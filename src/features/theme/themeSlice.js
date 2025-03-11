// features/theme/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
  primaryColor: '#2d3e50',
  secondaryColor: '#e74c3c',
  borderRadius: 8,
  fontFamily: 'Inter'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    updatePrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
    },
    updateThemeSettings: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { toggleThemeMode, updatePrimaryColor } = themeSlice.actions;
export default themeSlice.reducer;