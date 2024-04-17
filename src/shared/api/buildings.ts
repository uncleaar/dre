import { Params } from "shared/api/users";
import { Building, Buildings } from "types/building";

import { api } from "./api";

interface GetBuildingsParams extends Params {
	occupancyStatus?: string[];
}

export const getBuildings = async ({
	page,
	perPage,
	sortBy,
	sortOrder,
	search,
	occupancyStatus
}: GetBuildingsParams): Promise<Buildings> => {
	const response = await api.get(`/buildings`, {
		params: {
			...(page ? { page } : {}),
			...(perPage ? { perPage } : {}),
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {}),
			...(occupancyStatus ? { occupancyStatus } : {})
		}
	});
	return response.data;
};

export const getBuildingById = async (
	id: string,
	{
		contacts,
		amenities,
		utilities
	}: { contacts?: boolean; amenities?: boolean; utilities?: boolean }
): Promise<Building> => {
	const response = await api.get(`/buildings/${id}`, {
		params: {
			...(contacts ? { contacts } : {}),
			...(amenities ? { amenities } : {}),
			...(utilities ? { utilities } : {})
		}
	});

	return response.data;
};

export const deleteBuilding = async (id: string): Promise<{ success: boolean }> => {
	const response = await api.delete(`/buildings/${id}`);
	return response.data;
};

export const createBuilding = async (data: { name: string }): Promise<Building> => {
	const response = await api.post(`/buildings`, data);
	return response.data;
};

export const updateBuilding = async (
	data: Building,
	buildingId: string
): Promise<{ success: boolean }> => {
	const response = await api.put(`/buildings/${buildingId}`, data);
	return response.data;
};

export const getBuildingDictionaries = async () => {
	const response = await api.get(`/buildings/dictionaries`);
	return response.data;
};
