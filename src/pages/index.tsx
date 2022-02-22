import React, { ReactElement } from 'react';

import { Button } from '@mantine/core';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import ConditionalLink from '@components/ConditionalLink/ConditionalLink';

import styles from './index.module.scss';

const Home: NextPage = () => {
	return (
		<main>
			<Head>
				<title>bhop archive</title>
			</Head>

			<h1>bhop archive</h1>

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
