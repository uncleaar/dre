import { api } from "shared/api/api";
import { Params } from "shared/api/users";

import { Unit, Units, UnitStatuses } from "../../types/unit";

interface GetListingPublicationsBuildingsParams extends Params {
	listingPublicationId: string;
	status?: string[];
}

export const getListingPublicationsUnits = async ({
	page,
	perPage,
	search,
	sortBy,
	sortOrder,
	listingPublicationId,
	status
}: GetListingPublicationsBuildingsParams): Promise<Units> => {
	const response = await api.get<Units>(`/listing-publications-units/${listingPublicationId}`, {
		params: {
			page,
			perPage,
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {}),
			...(status?.length ? { status } : {})
		}
	});
	return response.data as Units;
};

export const getListingPublicationsUnit = async (
	listingPublicationId: string,
	unitId: string,
	{
		contacts,
		amenities,
		utilities
	}: { contacts?: boolean; amenities?: boolean; utilities?: boolean }
): Promise<Unit> => {
	const response = await api.get<Unit>(
		`/listing-publications-units/${listingPublicationId}/${unitId}`,
		{
			params: {
				...(contacts ? { contacts } : {}),
				...(amenities ? { amenities } : {}),
				...(utilities ? { utilities } : {})
			}
		}
	);
	return response.data as Unit;
};

export const createListingPublicationUnit = async (
	listingPublicationId: string,
	unitId: string
): Promise<Unit> => {
	const response = await api.post(
		`/listing-publications-units/${listingPublicationId}/${unitId}`,
		{}
	);
	return response.data;
};

export const updateListingPublicationUnit = async (
	listingPublicationId: string,
	unitId: string,
	data: Unit
): Promise<{ success: boolean }> => {
	const response = await api.put(
		`/listing-publications-units/${listingPublicationId}/${unitId}`,
		data
	);
	return { success: response.data };
};

export const deleteListingPublicationUnit = async (
	listingPublicationId: string,
	unitId: string
): Promise<{ success: boolean }> => {
	return await api.delete(`/listing-publications-units/${listingPublicationId}/${unitId}`);
};
