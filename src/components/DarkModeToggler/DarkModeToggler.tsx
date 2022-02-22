import React, { ReactElement, useContext } from 'react';
import { ActionIcon } from '@mantine/core';
import { MoonIcon } from '@radix-ui/react-icons';

import ThemeContext from '../../context/ThemeContext';

const DarkModeToggler = (): ReactElement => {
	const { darkTheme, toggleDarkTheme } = useContext(ThemeContext);

	return (
		<ActionIcon
			variant={darkTheme ? 'filled' : 'outline'}
			color="indigo"
			onClick={toggleDarkTheme}
			aria-label="toggle dark mode">
			<MoonIcon />
		</ActionIcon>
	);
};

export default DarkModeToggler;
