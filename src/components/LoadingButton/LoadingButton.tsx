import React from 'react';
import {
	Button,
	Loader as MantineLoader,
	ButtonProps,
} from '@mantine/core';

import styles from './LoadingButton.module.scss';

interface LoadingButtonProps extends ButtonProps<'button'> {
	label?: string;
	loading: boolean;
}

export const LoadingButton = ({
	label,
	loading,
	...props
}: LoadingButtonProps) => {
	return (
		<div
			className={`${styles.loadingButton} ${loading && styles.loading} ${
				props.className
			}`}>
			<Button {...props}>
				<span className={styles.spinner}>
					<MantineLoader style={{ color: 'white' }} size={24} />
				</span>
				{label && <span className={styles.label}>{label}</span>}
			</Button>
		</div>
	);
};

export default LoadingButton;
