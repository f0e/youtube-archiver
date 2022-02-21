import React, { ReactElement } from 'react';

import { Button } from '@mantine/core';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import styles from './index.module.scss';

const Home: NextPage = () => {
	return (
		<main className={styles.homePage}>
			<Head>
				<title>bhop archive</title>
			</Head>

			<h1>bhop archive</h1>

			<div className={styles.links}>
				<Link href="/browse" passHref>
					<Button>browse</Button>
				</Link>

				<Link href="/add" passHref>
					<Button>add</Button>
				</Link>

				<Link href="/filter" passHref>
					<Button>filter</Button>
				</Link>

				<Link href="/connections" passHref>
					<Button variant="outline" color="dark">
						connections
					</Button>
				</Link>
			</div>
		</main>
	);
};

export default Home;
