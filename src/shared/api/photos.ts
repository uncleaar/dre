import { api } from "shared/api/api";

import { Photo, Photos } from "../../types/photos";

export const addPhoto = async (entityId: string, file: File): Promise<Photo> => {
	const response = await api.post(
		`/photos/${entityId}`,
		{
			files: file
		},
		{
			headers: {
				"Content-Type": "multipart/form-data"
			}
		}
	);
	return response.data;
};

export const getPhoto = async (id: string): Promise<Photo> => {
	const response = await api.get(`/photos/${id}`);
	return response.data;
};

export const getPhotos = async (
	entityId: string,
	{
		page = 1,
		perPage = 100,
		sortBy = "order",
		sortOrder = 1
	}: { page?: number; perPage?: number; sortBy?: string; sortOrder?: number }
): Promise<Photos> => {
	const response = await api.get(`/photos/list/${entityId}`, {
		params: {
			...(page ? { page } : {}),
			...(perPage ? { perPage } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {})
		}
	});
	return response.data;
};

export const updatePhoto = async () => {};

export const deletePhoto = async (id: string): Promise<{ success: true }> => {
	const response = await api.delete(`/photos/${id}`);
	return response.data;
};
