import '@styles/variables.scss';
import '@styles/globals.scss';

import { useEffect } from 'react';

import { MantineProvider } from '@mantine/core';
import {
	NotificationsProvider,
	useNotifications,
} from '@mantine/notifications';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { ApiStore } from '@context/ApiContext';
import { ThemeStore } from '@context/ThemeContext';
import {
	AnimatePresence,
	domAnimation,
	LazyMotion,
	motion,
} from 'framer-motion';
import Navbar from '@components/Navbar/Navbar';

const NotificationClearer = ({ children }: any) => {
	const router = useRouter();
	const notifications = useNotifications();

	useEffect(() => notifications.clean(), [router.asPath]);

	return <>{children}</>;
};

function MyApp({ Component, pageProps, router }: AppProps) {
	return (
		<>
			<Head>
				<title>bhop archive</title>
				<meta
					name="description"
					content="preserving the history of the greatest community in the world."
				/>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>

			<ThemeStore>
				<NotificationsProvider>
					<NotificationClearer>
						<ApiStore>
							<Navbar />

							<LazyMotion features={domAnimation}>
								<AnimatePresence>
									<motion.div
										key={router.asPath}
										initial={{ opacity: 0, x: -5 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.2 }}>
										<Component {...pageProps} />
									</motion.div>
								</AnimatePresence>
							</LazyMotion>
						</ApiStore>
					</NotificationClearer>
				</NotificationsProvider>
			</ThemeStore>
		</>
	);
}

export default MyApp;
