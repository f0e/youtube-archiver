import React, {
	ReactElement,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { Button } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { BarChartIcon } from '@radix-ui/react-icons';

import ConditionalLink from '../../components/ConditionalLink/ConditionalLink';
import Loader from '../../components/Loader/Loader';
import LoadingImage from '../../components/LoadingImage/LoadingImage';
import ApiContext, { ApiState } from '../../context/ApiContext';
import Channel from '../../types/channel';
import Video from '../../types/video';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import styles from './watch.module.scss';

interface CommentProps {
	comment: any;
	replies?: any[];
}

const Comment = ({ comment, replies }: CommentProps): ReactElement => {
	const channelLink = (children: any) => (
		<ConditionalLink
			to={`/channel/${comment.data.author_id}`}
			condition={comment.parsed}>
			{children}
		</ConditionalLink>
	);

	const commentTimeAgo = dayjs.unix(comment.data.timestamp).fromNow();

	return (
		<div key={comment.data.id} className={styles.comment}>
			<div className={styles.commentMain}>
				<div className={styles.commentTop}>
					<div
						className={`${styles.channelAvatar} ${
							!comment.parsed ? ' unparsed' : ''
						}`}>
						{channelLink(
							<LoadingImage
								src={comment.data.author_thumbnail}
								alt={`${comment.data.author}'s avatar`}
							/>
						)}
					</div>

					<div>
						<div className={styles.channelNameAndDate}>
							{channelLink(
								<div
									className={
										'channel-name' +
										(comment.data.author_is_uploader ? ' uploader' : '') +
										(!comment.parsed ? ' unparsed' : '')
									}>
									{comment.data.author}
								</div>
							)}

							<div className={styles.commentDate}>{commentTimeAgo}</div>
						</div>

						<div className={styles.commentText}>{comment.data.text}</div>
					</div>
				</div>

				{(comment.data.like_count > 0 || comment.data.is_favorited) && (
					<div className={styles.commentBottom}>
						{comment.data.like_count > 0 && (
							<div className={styles.commentLikes}>
								<span className={styles.commentLikeNumber}>
									{comment.data.like_count}
								</span>
								<span> likes</span>
							</div>
						)}

						{comment.data.is_favorited && (
							<div className={styles.favourited}>favourited</div>
						)}
					</div>
				)}
			</div>

			{replies && replies.length > 0 && (
				<div className={styles.commentReplies}>
					{replies.map((reply) => (
						<Comment key={reply.data.id} comment={reply} />
					))}
				</div>
			)}
		</div>
	);
};

interface VideoCommentsProps {
	comments: any[];
}

const VideoComments = ({ comments }: VideoCommentsProps): ReactElement => {
	const [parsedCommenters, setParsedCommenters] = useState(
		new ApiState(comments.length != 0)
	);

	const Api = useContext(ApiContext);

	useEffect(() => {
		if (comments.length == 0) return;

		Api.getState(setParsedCommenters, '/api/check-channels-parsed', {
			channelIds: comments.map((comment) => comment.author_id),
		});
	}, [comments]);

	const fixComments = (comments: any) => {
		// store which channels are parsed
		comments = comments.map((comment: any) => ({
			data: comment,
			parsed: parsedCommenters.data && parsedCommenters.data[comment.author_id],
		}));

		// fix replies
		const fixedComments = [];

		// add root comments
		for (const comment of comments) {
			if (comment.data.parent == 'root') {
				fixedComments.push({
					comment,
					replies: [],
				});
			}
		}

		// add replies
		for (const comment of comments) {
			if (comment.data.parent != 'root') {
				const parentComment: any = fixedComments.find(
					(parentComment) =>
						parentComment.comment.data.id == comment.data.parent
				);

				if (parentComment) {
					parentComment.replies.push(comment);
				}
			}
		}

		return fixedComments;
	};

	return (
		<div className={styles.comments}>
			{parsedCommenters.loading ? (
				<Loader message="loading comments" />
			) : parsedCommenters.error ? (
				<h2>failed to load comments</h2>
			) : (
				fixComments(comments).map((comment: any) => (
					<Comment
						key={comment.comment.data.id}
						comment={comment.comment}
						replies={comment.replies}
					/>
				))
			)}
		</div>
	);
};

interface VideoPlayerProps {
	video: Video;
	channel: Channel;
	basicVideo: any;
}

const VideoPlayer = ({
	video,
	channel,
	basicVideo,
}: VideoPlayerProps): ReactElement => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		loadVolume();
	}, [videoRef]);

	const loadVolume = () => {
		if (!videoRef.current) return;

		const volume = localStorage.getItem('volume');
		if (!volume) return;

		videoRef.current.volume = parseFloat(volume);
	};

	const storeVolume = () => {
		if (!videoRef.current) return;
		localStorage.setItem('volume', videoRef.current.volume.toString());
	};

	const showVideo = () => {
		if (!videoRef.current) return;
		videoRef.current.classList.remove('loading-video');
	};

	const uploadDate = dayjs(video.data.upload_date, 'YYYY-MM-DD')
		.toDate()
		.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});

	return (
		<div className={styles.video}>
			<video
				className={`${styles.videoPlayer} loadingVideo`}
				style={{ aspectRatio: `${video.data.width} / ${video.data.height}` }}
				controls
				onLoadedData={showVideo}
				ref={videoRef}
				onVolumeChange={storeVolume}
				// autoPlay
			>
				<source
					src={`/api/get-video-stream?videoId=${video.id}`}
					type="video/mp4"
				/>
			</video>

			<div className={styles.videoInfo}>
				<div>
					<h1 style={{ marginBottom: '0.5rem' }}>{video.data.title}</h1>

					<div className={styles.viewsAndDate}>
						{basicVideo.viewCountText} • {`${uploadDate}`}
					</div>
				</div>

				<div className={styles.likes}>
					{!video.data.like_count ? (
						<div>likes hidden</div>
					) : (
						<>
							<span className={styles.likeNumber}>{video.data.like_count}</span>
							<span> likes</span>
						</>
					)}
				</div>
			</div>

			<div className={styles.spacer} />

			<Link href={`/channel/${video.data.channel_id}`}>
				<a className={styles.videoChannel}>
					<div className={styles.channelAvatar}>
						<LoadingImage
							className={styles.channelAvatar}
							src={channel.data.authorThumbnails.at(-1).url}
							alt={`${channel.data.author}'s avatar`}
						/>
					</div>

					<div className={styles.channelNameAndSubs}>
						<div className={styles.channelName}>{video.data.channel}</div>
						<div className={styles.channelSubs}>
							{channel.data.subscriberCount == 0
								? '0 or hidden subscribers'
								: channel.data.subscriberText}
						</div>
					</div>
				</a>
			</Link>

			{video.data.description && (
				<div className={styles.videoDescription}>{video.data.description}</div>
			)}

			<div className={styles.videoMetadata}>
				<div className={styles.videoCategory}>
					{video.data.categories.join(', ')}
				</div>

				{video.data.track && (
					<a
						className={styles.videoSong}
						href={`https://www.youtube.com/results?search_query=${video.data.artist} - ${video.data.song}`}>
						<BarChartIcon className={styles.songIcon} />

						<div className={styles.songTitle}>
							{video.data.artist} - {video.data.track}
						</div>
					</a>
				)}
			</div>

			<div className={styles.spacer} />

			{video.data.comments.length == 0 ? (
				<h2>no comments / disabled</h2>
			) : (
				<>
					<h2>
						comments
						<span className={styles.commentCount}>
							{' '}
							- {video.data.comments.length}
						</span>
					</h2>

					<VideoComments comments={video.data.comments} />
				</>
			)}
		</div>
	);
};

const Watch = ({
	videoInfo,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactElement => {
	const router = useRouter();

	return (
		<main className={styles.watchPage}>
			{!videoInfo ? (
				<>
					<h1>failed to load video</h1>
					<Button onClick={() => router.back()}>back</Button>
				</>
			) : (
				<VideoPlayer
					video={videoInfo.video}
					channel={videoInfo.channel}
					basicVideo={videoInfo.basicVideo}
				/>
			)}
		</main>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const res = await axios.get('http://localhost:3001/api/get-video-ids');

	return {
		paths: res.data.map((id: string) => ({ params: { videoId: id } })),
		fallback: true, // false or 'blocking'
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { videoId } = context.params as any;

	const res = await axios.get('http://localhost:3001/api/get-video-info', {
		params: {
			videoId,
		},
	});

	// remove unnecessary data to lower total data size
	const requiredChannelDataFields = [
		'authorThumbnails',
		'author',
		'subscriberCount',
		'subscriberText',
	];

	const requiredVideoDataFields = [
		'upload_date',
		'width',
		'height',
		'title',
		'like_count',
		'channel_id',
		'channel',
		'description',
		'categories',
		'track',
		'artist',
		'song',
		'artist',
		'track',
		'comments',
	];

	delete res.data.channel.videos;

	for (const key in res.data.channel.data)
		if (!requiredChannelDataFields.includes(key))
			delete res.data.channel.data[key];

	for (const key in res.data.video.data)
		if (!requiredVideoDataFields.includes(key)) delete res.data.video.data[key];

	return {
		props: { videoInfo: res.data },
	};
};

export default Watch;