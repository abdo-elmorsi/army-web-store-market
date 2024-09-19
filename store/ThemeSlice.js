import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state, { payload }) => {
      state.theme = payload;
      localStorage.setItem("theme", payload);
      document.documentElement.classList.toggle("dark", payload === "dark");
    },
  },
});

export const { toggleTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;
