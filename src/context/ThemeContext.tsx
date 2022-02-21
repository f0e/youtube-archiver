import React, {
	createContext,
	FunctionComponent,
	useEffect,
	useState,
} from 'react';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { useColorScheme, useLocalStorageValue } from '@mantine/hooks';

interface ThemeContextInterface {
	darkTheme: boolean;
	setDarkTheme: (newDarkTheme: boolean) => void;
	toggleDarkTheme: () => void;
}

const ThemeContext = createContext({} as ThemeContextInterface);

export const ThemeStore: FunctionComponent = ({ children }) => {
	const preferredColorScheme = useColorScheme();

	const [_theme, _setTheme] = useLocalStorageValue({
		key: 'theme',
		defaultValue: preferredColorScheme,
	});

	useEffect(() => {
		localStorage.setItem('theme', _theme);
		document.documentElement.dataset.theme = _theme;
	}, [_theme]);

	const setDarkTheme = (newDarkTheme: boolean): void => {
		_setTheme(newDarkTheme ? 'dark' : 'light');
	};

	const toggleDarkTheme = (): void => {
		_setTheme((cur) => (cur == 'dark' ? 'light' : 'dark'));
	};

	const theme: MantineThemeOverride = {
		colorScheme: _theme,
		fontFamily: 'inherit',
	};

	return (
		<ThemeContext.Provider
			value={{ darkTheme: _theme == 'dark', setDarkTheme, toggleDarkTheme }}>
			<MantineProvider theme={theme}>{children}</MantineProvider>
		</ThemeContext.Provider>
	);
};

export default ThemeContext;
