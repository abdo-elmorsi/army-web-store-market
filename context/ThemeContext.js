import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

// Constants for action types
const TOGGLE_THEME = 'TOGGLE_THEME';

const ThemeContext = createContext();

// Lazy initialization of the theme from localStorage
const initialState = {
	theme: typeof window !== 'undefined' && localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light',
};

// Reducer function to manage theme state
const themeReducer = (state, action) => {
	switch (action.type) {
		case TOGGLE_THEME:
			return { ...state, theme: action.payload };
		default:
			return state;
	}
};

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
	const [state, dispatch] = useReducer(themeReducer, initialState);

	// Update the HTML class and localStorage when the theme changes
	useEffect(() => {
		document.documentElement.classList.toggle('dark', state.theme === 'dark');
		localStorage.setItem('theme', state.theme);
	}, [state.theme]);

	// Function to toggle between 'light' and 'dark' themes
	const toggleTheme = () => {
		const newTheme = state.theme === 'light' ? 'dark' : 'light';
		dispatch({ type: TOGGLE_THEME, payload: newTheme });
	};

	// Memoize the context value to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({
			theme: state.theme,
			toggleTheme,
		}),
		[state.theme]
	);

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
};

// Custom hook to use the ThemeContext
export const useTheme = () => {
	return useContext(ThemeContext);
};
