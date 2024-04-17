import { api } from "shared/api/api";
import { Params } from "shared/api/users";

import { Building, Buildings } from "../../types/building";

interface GetListingPublicationsBuildingsParams extends Params {
	listingPublicationId: string;
	occupancyStatus?: string[];
}

export const getListingPublicationsBuildings = async ({
	page,
	perPage,
	search,
	sortBy,
	sortOrder,
	occupancyStatus,
	listingPublicationId
}: GetListingPublicationsBuildingsParams): Promise<Buildings> => {
	const response = await api.get<Buildings>(
		`/listing-publications-buildings/${listingPublicationId}`,
		{
			params: {
				page,
				perPage,
				...(search ? { search } : {}),
				...(sortBy ? { sortBy } : {}),
				...(sortOrder ? { sortOrder } : {}),
				...(occupancyStatus ? { occupancyStatus } : {})
			}
		}
	);
	return response.data as Buildings;
};

export const getListingPublicationsBuilding = async (
	listingPublicationId: string,
	buildingId: string,
	{
		contacts,
		amenities,
		utilities
	}: { contacts?: boolean; amenities?: boolean; utilities?: boolean }
): Promise<Building> => {
	const response = await api.get(
		`/listing-publications-buildings/${listingPublicationId}/${buildingId}`,
		{
			params: {
				...(contacts ? { contacts } : {}),
				...(amenities ? { amenities } : {}),
				...(utilities ? { utilities } : {})
			}
		}
	);
	return response.data as Building;
};

export const createListingPublicationBuilding = async (
	listingPublicationId: string,
	buildingId: string
): Promise<Building> => {
	const response = await api.post(
		`/listing-publications-buildings/${listingPublicationId}/${buildingId}`,
		{}
	);
	return response.data;
};

export const updateListingPublicationBuilding = async (
	listingPublicationId: string,
	buildingId: string,
	data: Building
): Promise<{ success: boolean }> => {
	const response = await api.put(
		`/listing-publications-buildings/${listingPublicationId}/${buildingId}`,
		data
	);
	return { success: response.data };
};

export const deleteListingPublicationBuilding = async (
	listingPublicationId: string,
	buildingId: string
): Promise<{ success: boolean }> => {
	return await api.delete(`/listing-publications-buildings/${listingPublicationId}/${buildingId}`);
};
