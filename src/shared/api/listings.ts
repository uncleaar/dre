import { Params } from "shared/api/users.ts";
import { Listing, ListingList } from "types/listings";

import { api } from "./api";

export const getListings = async ({
	page,
	perPage,
	search,
	sortBy,
	sortOrder
}: Params): Promise<ListingList> => {
	const response = await api.get<ListingList>(`/listings`, {
		params: {
			...(page ? { page } : {}),
			...(perPage ? { perPage } : {}),
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {})
		}
	});
	return response.data as ListingList;
};

export const deleteListing = async (listingId: string): Promise<{ success: boolean }> => {
	return await api.delete(`/listings/${listingId}`);
};

export const createListing = async (entities?: string[]): Promise<{ success: boolean }> => {
	const response = await api.post(`/listings`, {});
	return { success: response.data.success };
};

export const updateListing = async (
	listingId: string,
	data: { entities: string[] }
): Promise<Listing> => {
	const response = await api.put(`/listings/${listingId}`, data);
	return response.data;
};

export const getListingById = async (listingId: string): Promise<Listing> => {
	const response = await api.get(`/listings/${listingId}`);
	return response.data;
};
