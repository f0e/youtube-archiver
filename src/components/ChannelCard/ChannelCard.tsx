import React, { ReactElement, useContext, useState } from 'react';
import Image from 'next/image';
import { Badge, Button, Card, Group, Text } from '@mantine/core';

import ApiContext from '../../context/ApiContext';
import Channel from '../../types/channel';
import ConditionalLink from '../ConditionalLink/ConditionalLink';
import LoadingButton from '../LoadingButton/LoadingButton';
import { VideoCard } from '../VideoCard/VideoCard';

import styles from './ChannelCard.module.scss';
import LoadingImage from '@components/LoadingImage/LoadingImage';

interface ChannelCardProps {
	channel: Channel;
	parsed: boolean;
	channelTools?: ReactElement;
}

export const ChannelCard = ({
	channel,
	parsed,
	channelTools,
}: ChannelCardProps): ReactElement => {
	const channelLink = (children: any) =>
		parsed ? (
			<ConditionalLink href={`/channel/${channel.id}`} condition={parsed}>
				{children}
			</ConditionalLink>
		) : (
			<a href={`https://youtube.com/channel/${channel.id}`}>{children}</a>
		);

	return (
		<Card className={styles.channelCard}>
			<div className={styles.channelHeader}>
				<div className={styles.channelAvatarAndName}>
					<div className={styles.channelAvatar}>
						{channelLink(
							<LoadingImage
								src={channel.data.authorThumbnails.at(-1).url}
								alt={`${channel.data.author}'s avatar`}
							/>
						)}
					</div>

					<div className={styles.channelNameAndSubs}>
						{channelLink(
							<div className={styles.channelName}>{channel.data.author}</div>
						)}

						<div className={styles.channelSubscriptions}>
							{channel.data.subscriberCount == 0
								? '0 or hidden subscribers'
								: channel.data.subscriberText}
						</div>
					</div>
				</div>

				<div className={styles.channelTools}>{channelTools}</div>
			</div>

			{channel.data.description && (
				<div className={styles.channelDescription}>
					{channel.data.description}
				</div>
			)}

			{channel.data.tags && (
				<div className={styles.channelTags}>
					{channel.data.tags.map((tag: string, i: number) => (
						<div key={`tag-${i}`} className={styles.channelTag}>
							{tag}
						</div>
					))}
				</div>
			)}

			{channel.videos.length == 0 ? (
				<div className={styles.noVideos}>no videos</div>
			) : (
				<div className={styles.channelVideos}>
					{channel.videos.map((video: any) => (
						<VideoCard
							key={video.videoId}
							basicVideo={video}
							fadeNotDownloaded={parsed}
							showChannel={false}
						/>
					))}
				</div>
			)}
		</Card>
	);
};
