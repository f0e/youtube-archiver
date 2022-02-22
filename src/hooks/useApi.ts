import { useNotifications } from '@mantine/notifications';
import axios from 'axios';
import { useEffect } from 'react';
import useSWR from 'swr';

type ApiCallParameters = {
	[key: string]: any;
};

export default function useApi(
	url: string,
	params?: ApiCallParameters,
	dontNotifyErrors?: boolean
) {
	const { data, error } = useSWR(url, (...args) =>
		axios
			.get(...args, {
				params,
			})
			.then((res) => res.data)
	);

	const notifications = useNotifications();

	useEffect(() => {
		if (error && !dontNotifyErrors) {
			const errorMessage = error.response?.data?.message;

			notifications.showNotification({
				title: 'fail',
				message:
					errorMessage ||
					'an unexpected error has occurred, please try again later',
				color: 'red',
			});
		}
	}, [error]);

	return {
		data,
		loading: !error && !data,
		error: error,
	};
}
