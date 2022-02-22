import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
	NextPage,
} from 'next';
import { Button } from '@mantine/core';
import { ChannelCard } from '../../components/ChannelCard/ChannelCard';

import styles from './channel.module.scss';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';

const ChannelPage: NextPage = ({
	channel,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactElement => {
	const router = useRouter();

	return (
		<main>
			{!channel ? (
				<>
					<h2>failed to load channel</h2>
					<Button onClick={() => router.back()}>back</Button>
				</>
			) : (
				<>
					<Head>
						<title>bhop archive | {channel.data.author}</title>
					</Head>

					<ChannelCard parsed={true} channel={channel} />
				</>
			)}
		</main>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const res = await axios.get('http://localhost:3001/api/get-channel-ids');

	return {
		paths: res.data.map((id: string) => ({ params: { channelId: id } })),
		fallback: true, // false or 'blocking'
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { channelId } = context.params as any;

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
};

export default ChannelPage;
