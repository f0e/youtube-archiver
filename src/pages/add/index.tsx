import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Button, Switch, Textarea, TextInput } from '@mantine/core';
import { useDocumentTitle, useForm } from '@mantine/hooks';
import ApiContext, { ApiState } from '../../context/ApiContext';
import Loader from '../../components/Loader/Loader';
import { ChannelCard } from '../../components/ChannelCard/ChannelCard';
import LoadingButton from '../../components/LoadingButton/LoadingButton';
import AcceptOrReject, {
	ChannelDestination,
} from '../../components/AcceptOrReject/AcceptOrReject';

import styles from './add.module.scss';
import { NextPage } from 'next';

interface SearchChannelsResultProps {
	channelUrl: string;
	channelsLeft: number;
	addingMultiple: boolean;
	getNextChannel: () => void;
}

const SearchChannelsResult = ({
	channelUrl,
	channelsLeft,
	addingMultiple,
	getNextChannel,
}: SearchChannelsResultProps): ReactElement => {
	const [destination, setDestination] = useState<null | ChannelDestination>(
		null
	);

	const [channel, setChannel] = useState<any>({
		loading: true,
		data: null,
	});

	const [lastChannelExists, setLastChannelExists] = useState(false);

	const loadChannel = async () => {
		try {
			setChannel({
				data: null,
				loading: true,
			});

			const data = await Api.get('/api/get-channel-info', {
				channel: channelUrl,
			});

			const existsCheck = () => {
				if (!addingMultiple) return false;

				const filteredExists = ['added', 'accepted', 'rejected', 'filtered'];
				if (filteredExists.includes(data.exists)) {
					setLastChannelExists(data.exists);
					return true;
				}

				setLastChannelExists(false);
				return false;
			};

			if (existsCheck()) {
				getNextChannel();
			} else {
				setChannel({
					data,
					loading: false,
				});
			}
		} catch (e: any) {
			getNextChannel();
		}
	};

	useEffect(() => {
		loadChannel();
	}, [channelUrl]);

	const Api = useContext(ApiContext);

	const onAcceptReject = async () => {
		getNextChannel();
	};

	const addChannel = async (destination: ChannelDestination) => {
		setDestination(destination);

		try {
			await Api.post('/api/add-channel', {
				channelId: channel.data.channel.id,
				destination,
			});

			setDestination(null);
			getNextChannel();
		} catch (e) {
			setDestination(null);
		}
	};

	const getChannelTools = () => {
		switch (channel.data.exists) {
			case 'queued': {
				return (
					<AcceptOrReject
						channelId={channel.data.channel.id}
						onAcceptReject={onAcceptReject}
					/>
				);
			}
			case undefined: {
				return (
					<div className={styles.addChannel}>
						<LoadingButton
							onClick={(e: any) => addChannel('accept')}
							label="add"
							loading={destination == 'accept'}
						/>
						<LoadingButton
							onClick={(e: any) => addChannel('acceptNoDownload')}
							variant="outline"
							label="add (no downloads)"
							loading={destination == 'acceptNoDownload'}
						/>
						<LoadingButton
							onClick={(e: any) => addChannel('reject')}
							color="red"
							label="reject"
							loading={destination == 'reject'}
						/>
						<Button
							variant="outline"
							onClick={(e: any) => getNextChannel()}
							color="red">
							don{"'"}t add
						</Button>
					</div>
				);
			}
		}

		return <></>;
	};

	return (
		<>
			{channelsLeft > 0 && (
				<div className={styles.lastChannelExists}>
					{channelsLeft} channel{channelsLeft == 1 ? '' : 's'} left
				</div>
			)}

			{channel.loading || lastChannelExists ? (
				<>
					<Loader message="loading channel" />

					{lastChannelExists && (
						<span className={styles.lastChannelExists}>
							last channel was already {lastChannelExists}
						</span>
					)}
				</>
			) : (
				<>
					<br />

					{channel.data.exists && (
						<h2>channel already {channel.data.exists}</h2>
					)}

					<ChannelCard
						channel={channel.data.channel}
						parsed={channel.data.exists == 'added'}
						channelTools={getChannelTools()}
					/>
				</>
			)}
		</>
	);
};

interface AddSingleChannelProps {
	searchChannels: (channels: string[]) => void;
}

const AddSingleChannel = ({
	searchChannels,
}: AddSingleChannelProps): ReactElement => {
	const form = useForm({
		initialValues: {
			channelUrl: '',
		},
	});

	const onSubmit = async (values: typeof form['values']) => {
		searchChannels([values.channelUrl]);
	};

	return (
		<form className={styles.channelAddForm} onSubmit={form.onSubmit(onSubmit)}>
			<TextInput
				placeholder="channel url"
				{...form.getInputProps('channelUrl')}
			/>

			<Button type="submit">search</Button>
		</form>
	);
};

interface AddMultipleChannelsProps {
	searchChannels: (channels: string[]) => void;
}

const AddMultipleChannels = ({
	searchChannels,
}: AddMultipleChannelsProps): ReactElement => {
	const Api = useContext(ApiContext);

	const form = useForm({
		initialValues: {
			channelUrls: '',
		},
	});

	const onSubmit = async (values: typeof form['values']) => {
		searchChannels(values.channelUrls.split('\n'));
	};

	return (
		<form className={styles.channelAddForm} onSubmit={form.onSubmit(onSubmit)}>
			<Textarea
				className={styles.channelAddMultiple}
				placeholder="channels (one per line)"
				{...form.getInputProps('channelUrls')}
			/>

			<Button type="submit">search</Button>
		</form>
	);
};

const AddChannelForm = (): ReactElement => {
	const [channelUrls, setChannelUrls] = useState<string[]>([]);
	const [multipleChannels, setMultipleChannels] = useState(false);
	const [channelIndex, setChannelIndex] = useState(0);
	const [searched, setSearched] = useState(false);

	const searchChannels = (newChannelUrls: string[]) => {
		setSearched(true);
		setChannelUrls(newChannelUrls);
		setChannelIndex(0);
	};

	const getNextChannel = () => {
		setChannelIndex((cur) => cur + 1);
	};

	const channelsLeft = channelUrls.length - (channelIndex + 1);

	return (
		<>
			<Switch
				label="multiple channels"
				onChange={(e) => setMultipleChannels(e.currentTarget.checked)}
			/>

			<br />

			{!multipleChannels ? (
				<AddSingleChannel searchChannels={searchChannels} />
			) : (
				<AddMultipleChannels searchChannels={searchChannels} />
			)}

			<br />

			{searched && (
				<>
					{multipleChannels && channelsLeft == 0 ? (
						<h2>finished adding channels</h2>
					) : (
						<SearchChannelsResult
							channelUrl={channelUrls[channelIndex]}
							channelsLeft={channelsLeft}
							addingMultiple={multipleChannels}
							getNextChannel={getNextChannel}
						/>
					)}
				</>
			)}
		</>
	);
};

const AddChannel: NextPage = () => {
	useDocumentTitle('bhop archive | add');

	return (
		<main className={styles.addChannelPage}>
			<h1 style={{ marginBottom: '0.5rem' }}>add channel</h1>
			<br />

			<AddChannelForm />
		</main>
	);
};

export default AddChannel;
