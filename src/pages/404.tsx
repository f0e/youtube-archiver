import { Button } from '@mantine/core';
import { NextPage } from 'next';
import Head from 'next/head';

import ConditionalLink from '@components/ConditionalLink/ConditionalLink';

const Custom404: NextPage = () => {
	return (
		<main>
			<Head>
				<title>archive | 404</title>
			</Head>

			<h1>404</h1>
			<div>page does not exist</div>

			<br />

			<ConditionalLink href="/">
				<Button>home</Button>
			</ConditionalLink>
		</main>
	);
};

export default Custom404;
