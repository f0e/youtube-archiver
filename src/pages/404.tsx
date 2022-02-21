import { Button } from '@mantine/core';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Custom404: NextPage = () => {
	return (
		<main>
			<Head>
				<title>bhop archive - 404</title>
			</Head>

			<h1>404</h1>
			<div>page does not exist</div>

			<br />

			<Link href="/" passHref>
				<Button>home</Button>
			</Link>
		</main>
	);
};

export default Custom404;
