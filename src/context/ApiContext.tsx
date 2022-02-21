import React, { createContext, FunctionComponent, useContext } from 'react';
import { useNotifications } from '@mantine/notifications';
import axios, { AxiosRequestConfig } from 'axios';

export class ApiState {
	data: any = null;
	loading: boolean = true;
	error: any | null = null;

	constructor(startLoading: boolean = true) {
		this.loading = startLoading;
	}
}

type ApiCallParameters = {
	[key: string]: any;
};

export interface ApiContextInterface {
	get: (
		url: string,
		parameters?: ApiCallParameters,
		options?: AxiosRequestConfig<any>,
		dontNotifyErrors?: boolean
	) => Promise<any>;

	getState: (
		set: React.Dispatch<React.SetStateAction<any>>,
		url: string,
		parameters?: ApiCallParameters,
		options?: AxiosRequestConfig<any>,
		dontNotifyErrors?: boolean
	) => Promise<any>;

	post: (
		url: string,
		body?: ApiCallParameters,
		options?: AxiosRequestConfig<any>,
		dontNotifyErrors?: boolean
	) => Promise<any>;
}

const ApiContext = createContext({} as ApiContextInterface);

export const ApiStore: FunctionComponent = ({ children }) => {
	const notifications = useNotifications();

	const onError = (errorMessage: string | null) => {
		notifications.showNotification({
			title: 'fail',
			message:
				errorMessage ||
				'an unexpected error has occurred, please try again later',
			color: 'red',
		});
	};

	const get = async (
		url: string,
		parameters?: ApiCallParameters,
		options?: AxiosRequestConfig<any>,
		dontNotifyErrors?: boolean
	): Promise<any> => {
		try {
			const res = await axios.get(url, {
				params: parameters,
				...options,
			});

			return res.data;
		} catch (e: any) {
			const errorMessage = e.response?.data?.message;

			if (!dontNotifyErrors) onError(errorMessage);

			throw errorMessage;
		}
	};

	const getState = async (
		set: React.Dispatch<React.SetStateAction<any>>,
		url: string,
		parameters?: ApiCallParameters,
		options?: AxiosRequestConfig<any>,
		dontNotifyErrors?: boolean
	): Promise<any> => {
		try {
			set({
				data: null,
				loading: true,
				error: null,
			});

			const res = await axios.get(url, {
				params: parameters,
				...options,
			});

			set({
				data: res.data,
				loading: false,
				error: null,
			});
		} catch (e: any) {
			const errorMessage = e.response?.data?.message;

			if (!dontNotifyErrors) onError(errorMessage);

			set({
				data: null,
				loading: false,
				error: e,
			});
		}
	};

	const post = async (
		url: string,
		parameters?: ApiCallParameters,
		options?: AxiosRequestConfig<any>,
		dontNotifyErrors?: boolean
	): Promise<any> => {
		try {
			const res = await axios.post(url, parameters, options);

			return res.data.data;
		} catch (e: any) {
			const errorMessage = e.response?.data?.message;

			if (!dontNotifyErrors) onError(errorMessage);

			throw errorMessage;
		}
	};

	return (
		<ApiContext.Provider value={{ get, getState, post }}>
			{children}
		</ApiContext.Provider>
	);
};

export default ApiContext;
