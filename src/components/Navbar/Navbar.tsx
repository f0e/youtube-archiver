import { ReactElement } from 'react';
import { Header } from '@mantine/core';
import Link from 'next/link';

import DarkModeToggler from '../DarkModeToggler/DarkModeToggler';

import styles from './Navbar.module.scss';

const Navbar = (): ReactElement => {
	return (
		<div className={styles.navbar}>
			<Link href="/" passHref>
				<a className={styles.navbarTitle}>bhop archive</a>
			</Link>

			<div style={{ flexGrow: 1 }}></div>

			<DarkModeToggler />
		</div>
	);
};

export default Navbar;
