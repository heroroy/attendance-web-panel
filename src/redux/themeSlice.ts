import {createSlice} from "@reduxjs/toolkit";

interface ThemeState {
    theme: string
}

const initialState: ThemeState = {
    theme: "winter"
}

export const themeSlice = createSlice({
    name: "themeToggle",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === "winter" ? "night" : "winter";
            document.documentElement.setAttribute("data-theme", state.theme);
        }
    }
})