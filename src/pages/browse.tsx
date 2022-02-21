import React, {
	ReactElement,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useRouter } from 'next/router';
import CountUp from 'react-countup';

import { ChannelCard } from '@components/ChannelCard/ChannelCard';
import Loader from '@components/Loader/Loader';
import { VideoCard } from '@components/VideoCard/VideoCard';
import ApiContext, { ApiState } from '@context/ApiContext';

import Channel from '@customTypes/channel';
import Video from '@customTypes/video';

import Fuse from 'fuse.js';

import styles from './browse.module.scss';

interface SearchItem {
	name: string;
	data: any;
	elem: ReactElement;
}

interface SearchBarProps {
	items: SearchItem[];
	onSearch: (results: any[]) => void;
	maxResults: number;
}

const SearchBar = ({ items, onSearch, maxResults }: SearchBarProps) => {
	const form = useForm({
		initialValues: {
			query: '',
		},
	});

	const fuse = new Fuse(items, {
		keys: ['name'],
	});

	const search = (values: typeof form['values']) => {
		const fuseResults = fuse.search(values.query);
		const results = fuseResults
			.map((result) => result.item)
			.slice(0, maxResults);

		onSearch(results);
	};

	return (
		<form onSubmit={form.onSubmit(search)}>
			<TextInput placeholder="search" {...form.getInputProps('query')} />
		</form>
	);
};

interface SearchProps {
	channels: Channel[];
}

const Search = ({ channels: allChannels }: SearchProps): ReactElement => {
	const [results, setResults] = useState<any[]>([]);
	const [searched, setSearched] = useState(false);

	const videos = allChannels.map((channel) => channel.videos).flat();

	const [randomVideos, setRandomVideos] = useState<any[]>(() => {
		const randomVideos: any[] = [];

		while (randomVideos.length < Math.min(10, videos.length)) {
			const randomVideo = videos[Math.floor(Math.random() * videos.length)];

			if (randomVideos.includes(randomVideo)) continue;
			if (!randomVideo.downloaded) continue;

			randomVideos.push(randomVideo);
		}

		return randomVideos;
	});

	const channelsInput = allChannels.map(
		(channel): SearchItem => ({
			name: channel.data.author,
			data: channel,
			elem: <ChannelCard key={channel.id} parsed={true} channel={channel} />,
		})
	);

	const videosInput = videos.map(
		(video): SearchItem => ({
			name: video.title,
			data: video,
			elem: (
				<VideoCard
					key={video.videoId}
					basicVideo={video}
					fadeNotDownloaded={true}
					showChannel={true}
				/>
			),
		})
	);

	const searchItems = [...channelsInput, ...videosInput];

	const onSearch = (results: any) => {
		setResults(results);
		setSearched(true);
	};

	return (
		<>
			<SearchBar
				items={searchItems}
				onSearch={(results: any) => onSearch(results)}
				maxResults={10}
			/>

			<br />

			<div className={styles.results}>
				{!searched ? (
					randomVideos.map((video) => (
						<VideoCard
							key={video.videoId}
							basicVideo={video}
							fadeNotDownloaded={true}
							showChannel={true}
						/>
					))
				) : results.length == 0 ? (
					<h2>your search returned no results</h2>
				) : (
					results.map((result) => result.elem)
				)}
			</div>
		</>
	);
};

const DownloadedCount = (): ReactElement => {
	const [videoCount, setVideoCount] = useState({ from: 0, to: 0 });
	const [channelCount, setChannelCount] = useState({ from: 0, to: 0 });

	const videoSocket = useRef<WebSocket | null>(null);
	const channelSocket = useRef<WebSocket | null>(null);

	useEffect(() => {
		videoSocket.current = new WebSocket(
			'ws://localhost:3001/api/ws/video-count'
		);
		videoSocket.current.onmessage = async (e: MessageEvent) => {
			const count = JSON.parse(e.data);

			setVideoCount((cur) => ({
				from: cur.to,
				to: count,
			}));
		};

		channelSocket.current = new WebSocket(
			'ws://localhost:3001/api/ws/channel-count'
		);
		channelSocket.current.onmessage = async (e: MessageEvent) => {
			const count = JSON.parse(e.data);

			setChannelCount((cur) => ({
				from: cur.to,
				to: count,
			}));
		};

		const videoCurrent = videoSocket.current;
		const channelCurrent = channelSocket.current;
		return () => {
			videoCurrent.close();
			channelCurrent.close();
		};
	}, []);

	return (
		<div>
			<div className="count">
				<span className="count-number">
					<CountUp
						start={channelCount.from}
						end={channelCount.to}
						duration={0.25}
					/>{' '}
				</span>
				<span>channels archived</span>
			</div>

			<div className="count">
				<span className="count-number">
					<CountUp
						start={videoCount.from}
						end={videoCount.to}
						duration={0.25}
					/>{' '}
				</span>
				<span>videos archived</span>
			</div>
		</div>
	);
};

const Browse: NextPage = () => {
	const [channels, setChannels] = useState(new ApiState());

	const router = useRouter();

	const Api = useContext(ApiContext);

	useEffect(() => {
		Api.getState(setChannels, 'http://localhost:3001/api/get-channels');
	}, []);

	return (
		<main>
			<Head>
				<title>bhop archive | browse</title>
			</Head>

			<h1 style={{ marginBottom: '0.5rem' }}>browse</h1>
			<DownloadedCount />
			<br />

			{channels.loading ? (
				<Loader message="loading channels" />
			) : channels.error ? (
				<>
					<h2>failed to load channels</h2>
					<Button onClick={() => router.back()}>back</Button>
				</>
			) : channels.data.length == 0 ? (
				<>
					<h2>no channels found</h2>
					<Button onClick={() => router.back()}>back</Button>
				</>
			) : (
				<Search channels={channels.data} />
			)}
		</main>
	);
};

export default Browse;
