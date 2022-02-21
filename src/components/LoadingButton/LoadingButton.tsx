import React, { ReactElement } from 'react';
import {
	Button,
	ButtonVariant,
	MantineColor,
	Loader as MantineLoader,
} from '@mantine/core';

import styles from './LoadingButton.module.scss';

interface LoadingButtonProps {
	onClick?: (e: any) => void;
	label: string;
	type?: 'submit' | 'button' | 'reset';
	variant?: ButtonVariant;
	color?: MantineColor;
	style?: Record<string, unknown>;
	loading?: boolean;
	className?: string;
}

const LoadingButton = ({
	onClick,
	label,
	type,
	variant,
	color,
	style,
	loading,
	className,
}: LoadingButtonProps): ReactElement => {
	return (
		<div
			className={`${styles.LoadingButton} ${
				loading ? 'loading' : ''
			} ${className}`}>
			<Button
				type={type}
				onClick={onClick}
				disabled={loading}
				variant={variant}
				color={color}
				style={{ ...style, height: 35 }}>
				<span className={styles.spinner}>
					<MantineLoader style={{ color: 'white' }} size={24} />
				</span>
				<span className={styles.label}>{label}</span>
			</Button>
		</div>
	);
};

export default LoadingButton;
