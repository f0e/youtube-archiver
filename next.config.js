/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV !== 'production';
const rewritesConfig = isDevelopment
	? [
			{
				source: '/api/:path*',
				destination: 'http://localhost:3001/api/:path*',
			},
	  ]
	: [];

module.exports = {
	reactStrictMode: true,
	rewrites: async () => rewritesConfig,
	images: {
		domains: ['yt3.ggpht.com', 'i.ytimg.com', 'yt3.googleusercontent.com'],
	},
};
