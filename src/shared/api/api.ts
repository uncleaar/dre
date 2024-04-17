import axios from "axios";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "shared/constants";

const BASE_URL = "http://ec2-54-91-201-10.compute-1.amazonaws.com/api";

export const api = axios.create({
	baseURL: BASE_URL
});

api.defaults.headers.common["Content-Type"] = "application/json";

const UNAUTHORIZED = 401;

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(COOKIE_ACCESS_TOKEN);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

function createAxiosResponseInterceptor() {
	api.interceptors.response.use(
		(response) => response,
		(error) => {
			const errorResponse = error.response;
			if (errorResponse.status === UNAUTHORIZED && !error.config._retry) {
				error.config._retry = true;

				return api
					.post("/auth/refresh", {
						refresh: localStorage.getItem(COOKIE_REFRESH_TOKEN)
					})
					.then((response) => {
						const { accessToken, refreshToken } = response.data;

						localStorage.setItem(COOKIE_ACCESS_TOKEN, accessToken);
						localStorage.setItem(COOKIE_REFRESH_TOKEN, refreshToken);

						error.config.headers["Authorization"] = "Bearer " + accessToken;

						createAxiosResponseInterceptor();

						return api(error.config);
					})
					.catch((error) => {
						localStorage.removeItem(COOKIE_ACCESS_TOKEN);
						localStorage.removeItem(COOKIE_REFRESH_TOKEN);
						return Promise.reject(error);
					});
			}

			return Promise.reject(error);
		}
	);
}

createAxiosResponseInterceptor();
