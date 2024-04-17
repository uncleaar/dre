import { Permission, Permissions } from "types/permission";

import { api } from "./api";

export const getPermissions = async (): Promise<Permission[]> => {
	const response = await api.get<Permission[]>(`/permissions/sets`);
	return response.data;
};

export const getPermission = async (name: string): Promise<Permissions> => {
	const response = await api.get<Permissions>(`/permissions/sets/${name}`);
	return response.data;
};

export const deletePermission = async (name: string): Promise<{ success: boolean }> => {
	return await api.delete(`/permissions/sets/${name}`);
};

export const createPermission = async (data: {
	name: string;
	description: string;
}): Promise<Permission> => {
	const response = await api.post<Permission>(`/permissions/sets`, data);
	return response.data;
};

export const updatePermission = async (
	name: string,
	code: boolean
): Promise<{ success: boolean }> => {
	const response = await api.put(`/permissions/set-actions/${name}`, code);
	return { success: response.data };
};
