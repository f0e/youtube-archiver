import React, { ReactElement, useContext } from 'react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { MoonIcon } from '@radix-ui/react-icons';

const DarkModeToggler = (): ReactElement => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	return (
		<ActionIcon
			variant={colorScheme == 'dark' ? 'filled' : 'outline'}
			color="indigo"
			onClick={() => toggleColorScheme()}
			aria-label="toggle dark mode">
			<MoonIcon />
		</ActionIcon>
	);
};

export default DarkModeToggler;
