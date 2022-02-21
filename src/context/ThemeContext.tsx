import React, {
	createContext,
	FunctionComponent,
	useEffect,
	useState,
} from 'react';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';

interface ThemeContextInterface {
	darkTheme: boolean;
	setDarkTheme: (newDarkTheme: boolean) => void;
	toggleDarkTheme: () => void;
}

const ThemeContext = createContext({} as ThemeContextInterface);

export const ThemeStore: FunctionComponent = ({ children }) => {
	const [_darkTheme, _setDarkTheme] = useState((): boolean => {
		try {
			return JSON.parse(localStorage.getItem('darkTheme') as string);
		} catch (e) {
			return false;
		}
	});

	useEffect(() => {
		localStorage.setItem('darkTheme', JSON.stringify(_darkTheme));

		document.documentElement.dataset.theme = `theme-${
			_darkTheme ? 'dark' : 'light'
		}`;
	}, [_darkTheme]);

	const setDarkTheme = (newDarkTheme: boolean): void => {
		_setDarkTheme(newDarkTheme);
	};

	const toggleDarkTheme = (): void => {
		_setDarkTheme((cur) => !cur);
	};

	const theme: MantineThemeOverride = {
		colorScheme: _darkTheme ? 'dark' : 'light',
		fontFamily: 'inherit',
	};

	return (
		<ThemeContext.Provider
			value={{ darkTheme: _darkTheme, setDarkTheme, toggleDarkTheme }}>
			<MantineProvider theme={theme}>{children}</MantineProvider>
		</ThemeContext.Provider>
	);
};

export default ThemeContext;
