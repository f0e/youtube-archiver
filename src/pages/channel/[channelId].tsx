import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
	NextPage,
} from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@mantine/core';

import axios from 'axios';

import { ChannelCard } from '../../components/ChannelCard/ChannelCard';

interface MainContentProps {
	channel: any | null;
}

const MainContent = ({ channel }: MainContentProps): ReactElement => {
	const router = useRouter();

	if (!channel)
		return (
			<>
				<Head>
					<title>bhop archive | channel not found</title>
				</Head>

				<h1>channel not found</h1>
				<Button onClick={() => router.back()}>back</Button>
			</>
		);

	return (
		<>
			<Head>
				<title>bhop archive | {channel.data.author}</title>
			</Head>

			<ChannelCard parsed={true} channel={channel} />
		</>
	);
};

const ChannelPage: NextPage = ({
	channel,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactElement => {
	return (
		<main>
			<MainContent channel={channel} />
		</main>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const res = await axios.get('http://localhost:3001/api/get-channel-ids');

	return {
		paths: res.data.map((id: string) => ({ params: { channelId: id } })),
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { channelId } = context.params as any;

	try {
		const res = await axios.get('http://localhost:3001/api/get-channel', {
			params: {
				channelId,
			},
		});

		// remove unnecessary data to lower total data size
		const requiredChannelDataFields = [
			'authorThumbnails',
			'author',
			'subscriberCount',
			'subscriberText',
			'description',
			'tags',
		];

		const requiredChannelVideoFields = [
			'author',
			'downloaded',
			'durationText',
			'publishedText',
			'title',
			'videoId',
			'videoThumbnails',
			'viewCountText',
		];

		delete res.data._id;
		delete res.data.relations;

		for (const key in res.data.data)
			if (!requiredChannelDataFields.includes(key)) delete res.data.data[key];

		for (const video of res.data.videos) {
			for (const key in video)
				if (!requiredChannelVideoFields.includes(key)) delete video[key];
		}

		return {
			props: { channel: res.data },
		};
	} catch (e) {
		return {
			props: { channel: null },
		};
	}
};

export default ChannelPage;
