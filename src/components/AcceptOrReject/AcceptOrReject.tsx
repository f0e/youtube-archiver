import { Button } from '@mantine/core';
import React, { ReactElement, useContext, useState } from 'react';

import ApiContext from '../../context/ApiContext';
import LoadingButton from '../LoadingButton/LoadingButton';

import styles from './AcceptOrReject.module.scss';

export type ChannelDestination =
	| 'accept'
	| 'reject'
	| 'acceptNoDownload'
	| 'skip';

interface AcceptOrRejectProps {
	channelId: string;
	onAcceptReject?: () => void;
	onSkip?: () => void;
	disabled?: ChannelDestination[];
}

const AcceptOrReject = ({
	channelId,
	onAcceptReject,
	onSkip,
	disabled,
}: AcceptOrRejectProps): ReactElement => {
	const [destination, setDestination] = useState<null | ChannelDestination>(
		null
	);

	const Api = useContext(ApiContext);

	const acceptOrReject = async (newDestination: ChannelDestination) => {
		setDestination(destination);

		try {
			await Api.post('/api/move-channel', {
				channelId,
				destination: newDestination,
			});

			onAcceptReject && onAcceptReject();
		} catch (e) {
			setDestination(null);
		}
	};

	return (
		<div className={styles.acceptOrReject}>
			<LoadingButton
				onClick={() => acceptOrReject('accept')}
				label="accept"
				loading={destination == 'accept'}
				disabled={disabled?.includes('accept')}
			/>
			<LoadingButton
				onClick={() => acceptOrReject('acceptNoDownload')}
				variant="outline"
				label="accept (no downloads)"
				loading={destination == 'acceptNoDownload'}
				disabled={disabled?.includes('acceptNoDownload')}
			/>
			<LoadingButton
				onClick={() => acceptOrReject('reject')}
				color="red"
				label="reject"
				loading={destination == 'reject'}
				disabled={disabled?.includes('reject')}
			/>
			<Button onClick={() => onSkip && onSkip()} variant="outline">
				skip
			</Button>
		</div>
	);
};

export default AcceptOrReject;
