import React from 'react';

import { Button } from '@mantine/core';
import { NextPage } from 'next';
import Head from 'next/head';

import ConditionalLink from '@components/ConditionalLink/ConditionalLink';

import styles from './index.module.scss';

const Home: NextPage = () => {
	return (
		<main>
			<Head>
				<title>archive</title>
			</Head>

			<h1>archive</h1>

			<div className={styles.links}>
				<ConditionalLink href="/browse">
					<Button>browse</Button>
				</ConditionalLink>

				<ConditionalLink href="/add">
					<Button>add</Button>
				</ConditionalLink>

				<ConditionalLink href="/filter">
					<Button>filter</Button>
				</ConditionalLink>

				<ConditionalLink href="/connections">
					<Button variant="outline" color="dark">
						connections
					</Button>
				</ConditionalLink>
			</div>
		</main>
	);
};

export default Home;
