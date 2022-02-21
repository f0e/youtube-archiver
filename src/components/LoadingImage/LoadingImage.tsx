import React, { ReactElement, useRef, useState } from 'react';

import Image from 'next/image';

import styles from './LoadingImage.module.scss';

interface LoadingImageProps {
	className?: string;
	src: string;
	alt: string;
	unoptimized?: boolean;
	priority?: boolean;
}

const LoadingImage = ({
	className,
	src,
	alt,
	unoptimized,
	priority,
}: LoadingImageProps): ReactElement => {
	const [loaded, setLoaded] = useState(false);

	return (
		<Image
			className={`${className} ${styles.loadingImage} ${
				loaded && styles.imageLoaded
			}`}
			onLoadingComplete={() => setLoaded(true)}
			src={src}
			alt={alt}
			layout="fill"
			unoptimized={unoptimized}
			priority={priority}
		/>
	);
};

export default LoadingImage;
