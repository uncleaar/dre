import { api } from "shared/api/api";
import { Params } from "shared/api/users";

import { Room, Rooms } from "../../types/rooms";

interface GetListingPublicationsBuildingsParams extends Params {
	listingPublicationId: string;
}

export const getListingPublicationsRooms = async ({
	page,
	perPage,
	search,
	sortBy,
	sortOrder,
	listingPublicationId
}: GetListingPublicationsBuildingsParams): Promise<Rooms> => {
	const response = await api.get<Rooms>(`/listing-publications-rooms/${listingPublicationId}`, {
		params: {
			page,
			perPage,
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {})
		}
	});
	return response.data as Rooms;
};

export const getListingPublicationsRoom = async (
	listingPublicationId: string,
	roomId: string
): Promise<Room> => {
	const response = await api.get<Room>(
		`/listing-publications-rooms/${listingPublicationId}/${roomId}`
	);
	return response.data as Room;
};

export const createListingPublicationRoom = async (
	listingPublicationId: string,
	roomId: string
): Promise<Room> => {
	const response = await api.post(
		`/listing-publications-rooms/${listingPublicationId}/${roomId}`,
		{}
	);
	return response.data;
};

export const updateListingPublicationRoom = async (
	listingPublicationId: string,
	roomId: string,
	data: Room
): Promise<{ success: boolean }> => {
	const response = await api.put(
		`/listing-publications-rooms/${listingPublicationId}/${roomId}`,
		data
	);
	return { success: response.data };
};

export const deleteListingPublicationRoom = async (
	listingPublicationId: string,
	roomId: string
): Promise<{ success: boolean }> => {
	return await api.delete(`/listing-publications-rooms/${listingPublicationId}/${roomId}`);
};
