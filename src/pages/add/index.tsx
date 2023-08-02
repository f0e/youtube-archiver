import React, { ReactElement, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Switch, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import ApiContext from '../../context/ApiContext';
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

	const loadChannel = async () => {
		try {
			setChannel({
				data: null,
				loading: true,
			});

			const data = await Api.get('/api/get-channel-info', {
				channel: channelUrl,
			});

			setChannel({
				data,
				loading: false,
			});
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
		if (channel.data.exists) {
			let disabled: ChannelDestination[] = [];

			switch (channel.data.existsCollection) {
				case 'channels': {
					disabled = [
						channel.data.channel.dontDownload ? 'acceptNoDownload' : 'accept',
					];
					break;
				}
				case 'rejectedChannels': {
					disabled = ['reject'];
					break;
				}
			}

			return (
				<AcceptOrReject
					channelId={channel.data.channel.id}
					onAcceptReject={onAcceptReject}
					onSkip={onAcceptReject}
					disabled={disabled}
				/>
			);
		}

		return (
			<div className={styles.addChannel}>
				<LoadingButton
					onClick={() => addChannel('accept')}
					label="add"
					loading={destination == 'accept'}
				/>
				<LoadingButton
					onClick={() => addChannel('acceptNoDownload')}
					variant="outline"
					label="add (no downloads)"
					loading={destination == 'acceptNoDownload'}
				/>
				<LoadingButton
					onClick={() => addChannel('reject')}
					color="red"
					label="reject"
					loading={destination == 'reject'}
				/>
				<Button variant="outline" onClick={() => getNextChannel()} color="red">
					don{"'"}t add
				</Button>
			</div>
		);
	};

	return (
		<>
			{channelsLeft > 0 && (
				<div>
					{channelsLeft} channel{channelsLeft == 1 ? '' : 's'} left
				</div>
			)}

			{channel.loading ? (
				<>
					<Loader message="loading channel" />
				</>
			) : (
				<>
					<br />

					{channel.data.exists && (
						<h2>
							channel already {channel.data.exists}
							{channel.data.channel.dontDownload ? ' (not downloading)' : ''}
						</h2>
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

	const onSubmit = async (values: (typeof form)['values']) => {
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

	const onSubmit = async (values: (typeof form)['values']) => {
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
	return (
		<main>
			<Head>
				<title>archive | add</title>
			</Head>

			<h1 style={{ marginBottom: '0.5rem' }}>add channel</h1>
			<br />

			<AddChannelForm />
		</main>
	);
};

export default AddChannel;
