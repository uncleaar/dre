import { api } from "shared/api/api";
import { getListingPublicationsBuildings } from "shared/api/listing-publications-buildings";
import { getListingPublicationsRooms } from "shared/api/listing-publications-rooms";
import { getListingPublicationsUnits } from "shared/api/listing-publications-units";
import { Params } from "shared/api/users";

import { ListingPublication, ListingPublicationsList } from "../../types/listing-publications-list";

export const getListingPublications = async ({
	page,
	perPage,
	search,
	sortBy,
	sortOrder,
	listingSearch
}: Params): Promise<ListingPublicationsList> => {
	const response = await api.get<ListingPublicationsList>(`/listing-publications`, {
		params: {
			page,
			perPage,
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {}),
			...(listingSearch ? { "listingId[]": listingSearch } : {})
		}
	});
	return response.data as ListingPublicationsList;
};

export const getListingPublication = async (
	id: string,
	{ contacts }: { contacts?: boolean }
): Promise<ListingPublication> => {
	const response = await api.get<ListingPublication>(`/listing-publications/${id}`, {
		params: {
			...(contacts ? { contacts } : {})
		}
	});
	return response.data as ListingPublication;
};

export const createListingPublication = async (listingId: string): Promise<any> => {
	const response = await api.post(`/listing-publications/${listingId}`, {});
	return response.data;
};

export const deleteListingPublication = async (
	listingId: string
): Promise<{ success: boolean }> => {
	return await api.delete(`/listing-publications/${listingId}`);
};

export const updateListingPublication = async (
	data: Partial<ListingPublication>,
	listingId: string
): Promise<{ success: boolean }> => {
	const response = await api.put(`/listing-publications/${listingId}`, data);
	return response.data;
};

export const getListingPublicationConnectedContacts = async (publicationId: string) => {
	let entities: any = await Promise.all([
		getListingPublicationsBuildings({ listingPublicationId: publicationId }),
		getListingPublicationsUnits({ listingPublicationId: publicationId }),
		getListingPublicationsRooms({ listingPublicationId: publicationId })
	]);
	entities = entities.map((entity: any) => entity.list);

	const contacts: any[] = [];
	const contactsData: any[] = [];
	entities.forEach((entity: any) => {
		entity.forEach((item: any) => {
			contacts.push(...item.contacts);
			contactsData.push(...item.contactsData);
		});
	});
	return {
		contacts,
		contactsData
	};
};
