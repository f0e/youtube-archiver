import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
	static getInitialProps = getInitialProps;

	render() {
		return (
			<Html lang="en">
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=optional"
						rel="stylesheet"
					/>
					<script
						type="text/javascript"
						dangerouslySetInnerHTML={{
							__html: `const theme = localStorage.getItem('theme'); if (theme) document.documentElement.dataset.theme = theme;`,
						}}
					/>
				</Head>

				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
