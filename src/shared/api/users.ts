import { ListUsers, User } from "types/user";

import { api } from "./api";

export interface Params {
	page?: number;
	perPage?: number;
	sortOrder?: number | string;
	sortBy?: any;
	search?: string;
	listingSearch?: string;
}

interface GetUsersParams extends Params {
	role?: string[];
}

export const getUsers = async ({
	page,
	perPage,
	search,
	sortBy,
	sortOrder,
	role
}: GetUsersParams): Promise<ListUsers> => {
	const response = await api.get<ListUsers>(`/users`, {
		params: {
			page,
			perPage,
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {}),
			...(role?.length ? { role } : {})
		}
	});
	return response.data as ListUsers;
};

export const getUser = async (id: string): Promise<User> => {
	const response = await api.get<User>(`/users/${id}`);
	return response.data as User;
};

export const createUser = async (data: User): Promise<{ success: boolean }> => {
	const response = await api.post(`/users`, data);
	return { success: response.data.success };
};

export const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
	return await api.delete(`/users/${userId}`);
};

export const updateUser = async (data: User, userId: string): Promise<{ success: boolean }> => {
	const response = await api.put(`/users/${userId}`, data);
	return { success: response.data };
};
