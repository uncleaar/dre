import { User } from "types/user";

import { api } from "./api";

type LoginRequest = {
	email: string;
	password: string;
};

export const registerUser = async (user: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}) => {
	const response = await api.post<{ success: boolean }>("users/register-user", user);
	return response.data;
};

export const loginUser = async (
	data: LoginRequest
): Promise<{ accessToken: string; refreshToken: string }> => {
	const response = await api.post("/auth/login", data, { withCredentials: true });
	return response.data;
};

export const getMeFn = async () => {
	const response = await api.get<User>("users/me");
	return response.data;
};
