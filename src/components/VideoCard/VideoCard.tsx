import React, { ReactElement } from 'react';

import ConditionalLink from '../ConditionalLink/ConditionalLink';
import LoadingImage from '@components/LoadingImage/LoadingImage';
import useApi from '@hooks/useApi';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc);

import styles from './VideoCard.module.scss';

interface VideoCardDateProps {
	basicVideo: any;
}

const VideoCardDate = ({ basicVideo }: VideoCardDateProps) => {
	const { data: date } = useApi('/api/get-video-upload-date', {
		videoId: basicVideo.videoId,
	});

	return (
		<>
			{!date ? (
				<span className={styles.outdatedDate}>{basicVideo.publishedText}</span>
			) : (
				dayjs.utc(date, 'YYYY-MM-DD').from(dayjs.utc())
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
			<ConditionalLink href={`/watch/${basicVideo.videoId}`}>
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
