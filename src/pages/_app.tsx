import '@styles/variables.scss';
import '@styles/globals.scss';

import { useEffect } from 'react';

import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
} from '@mantine/core';
import { useColorScheme, useLocalStorageValue } from '@mantine/hooks';
import {
	NotificationsProvider,
	useNotifications,
} from '@mantine/notifications';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
	AnimatePresence,
	domAnimation,
	LazyMotion,
	motion,
} from 'framer-motion';

import { ApiStore } from '@context/ApiContext';
import Navbar from '@components/Navbar/Navbar';

const NotificationClearer = ({ children }: any) => {
	const router = useRouter();
	const notifications = useNotifications();

	useEffect(() => notifications.clean(), [router.asPath]);

	return <>{children}</>;
};

const App = ({ Component, pageProps, router }: AppProps) => {
	const preferredColorScheme = useColorScheme();

	const [colorScheme, setColorScheme] = useLocalStorageValue({
		key: 'theme',
		defaultValue: preferredColorScheme,
	});

	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useEffect(() => {
		document.documentElement.dataset.theme = colorScheme;
	}, [colorScheme]);

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

			<ColorSchemeProvider
				colorScheme={colorScheme}
				toggleColorScheme={toggleColorScheme}>
				<MantineProvider theme={{ colorScheme }}>
					<NotificationsProvider>
						<NotificationClearer>
							<ApiStore>
								<Navbar />

								<LazyMotion features={domAnimation}>
									<AnimatePresence
										// exitBeforeEnter
										initial={false}
										onExitComplete={() =>
											window && window.scrollTo({ top: 0 })
										}>
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
				</MantineProvider>
			</ColorSchemeProvider>
		</>
	);
};

export default App;
