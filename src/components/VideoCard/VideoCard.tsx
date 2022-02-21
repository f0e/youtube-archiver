import React, { ReactElement, useContext, useEffect, useState } from 'react';
import Image from 'next/image';

import ApiContext, { ApiState } from '../../context/ApiContext';
import ConditionalLink from '../ConditionalLink/ConditionalLink';
import Loader from '../Loader/Loader';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import styles from './VideoCard.module.scss';
import LoadingImage from '@components/LoadingImage/LoadingImage';

interface VideoCardDateProps {
	basicVideo: any;
}

const VideoCardDate = ({ basicVideo }: VideoCardDateProps) => {
	const [date, setDate] = useState<string | null>(null);

	const Api = useContext(ApiContext);

	const loadDate = async () => {
		const newDate = await Api.get('/api/get-video-upload-date', {
			videoId: basicVideo.videoId,
		});

		setDate(newDate);
	};

	useEffect(() => {
		loadDate();
	}, []);

	return (
		<>
			{!date ? (
				<span className={styles.outdatedDate}>{basicVideo.publishedText}</span>
			) : (
				dayjs(date, 'YYYY-MM-DD').fromNow()
			)}
		</>
	);
};

interface VideoCardProps {
	basicVideo: any;
	fadeNotDownloaded: boolean;
	showChannel: boolean;
}

export const VideoCard = ({
	basicVideo,
	fadeNotDownloaded,
	showChannel,
}: VideoCardProps): ReactElement => {
	const videoLink = (children: any) =>
		basicVideo.downloaded ? (
			<ConditionalLink
				to={`/watch?v=${basicVideo.videoId}`}
				condition={basicVideo.downloaded}>
				{children}
			</ConditionalLink>
		) : (
			<a href={`https://youtu.be/${basicVideo.videoId}`}>{children}</a>
		);

	return (
		<>
			{videoLink(
				<div
					className={`${styles.videoCard} ${
						!basicVideo.downloaded && fadeNotDownloaded ? ' unparsed' : ''
					}`}>
					<div className={styles.videoThumbnail}>
						<LoadingImage
							src={
								basicVideo.downloaded
									? `/api/get-video-thumbnail?videoId=${basicVideo.videoId}`
									: basicVideo.videoThumbnails.at(-1).url
							}
							alt={`thumbnail for video '${basicVideo.title}' by ${basicVideo.author}`}
							unoptimized
						/>

						<div className={styles.videoDuration}>
							{basicVideo.durationText}
						</div>
					</div>

					<div className={styles.videoDetails}>
						<div className={styles.videoTitle}>{basicVideo.title}</div>
						{showChannel && (
							<div className={styles.videoAuthor}> {basicVideo.author}</div>
						)}
						<div className={styles.viewsAndDate}>
							{basicVideo.viewCountText} •{' '}
							<VideoCardDate basicVideo={basicVideo} />
						</div>
					</div>
				</div>
			)}
		</>
	);
};
