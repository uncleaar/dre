import { api } from "shared/api/api";

import { Video, Videos } from "../../types/videos";

export const addVideo = async (
	entityId: string,
	data: { fileId: string; mimetype: string }
): Promise<Video> => {
	const response = await api.post(`/videos/${entityId}`, data);
	return response.data;
};

export const getVideo = async (id: string): Promise<Video> => {
	const response = await api.get(`/videos/${id}`);
	return response.data;
};

export const getVideos = async (
	entityId: string,
	{
		page = 1,
		perPage = 100,
		sortBy = "order",
		sortOrder = 1
	}: { page?: number; perPage?: number; sortBy?: string; sortOrder?: number }
): Promise<Videos> => {
	const response = await api.get(`/videos/list/${entityId}`, {
		params: {
			...(page ? { page } : {}),
			...(perPage ? { perPage } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {})
		}
	});
	return response.data;
};

export const deleteVideo = async (id: string): Promise<{ success: true }> => {
	const response = await api.delete(`/videos/${id}`);
	return response.data;
};
