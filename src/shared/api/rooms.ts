import { api } from "shared/api/api";
import { Params } from "shared/api/users";
import { Room, Rooms } from "types/rooms";

interface RoomParams extends Params {
	unitId?: string[];
}

export const getRooms = async ({
	page,
	perPage,
	sortBy,
	sortOrder,
	search,
	unitId
}: RoomParams): Promise<Rooms> => {
	const response = await api.get<Rooms>(`/rooms`, {
		params: {
			page,
			perPage,
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {}),
			...(unitId ? { unitId } : {})
		}
	});
	return response.data as Rooms;
};

export const createRoom = async (unitId: string, data: Room): Promise<Room> => {
	const response = await api.post<Room>(`/rooms/${unitId}`, data);
	return response.data as Room;
};

export const updateRoom = async (data: Room, id: string): Promise<{ success: boolean }> => {
	const response = await api.put(`/rooms/${id}`, data);
	return { success: response.data };
};

export const getRoom = async (
	id: string,
	{
		contacts,
		amenities,
		utilities
	}: { contacts?: boolean; amenities?: boolean; utilities?: boolean }
): Promise<Room> => {
	const response = await api.get<Room>(`/rooms/${id}`, {
		params: {
			...(contacts ? { contacts } : {}),
			...(amenities ? { amenities } : {}),
			...(utilities ? { utilities } : {})
		}
	});
	return response.data as Room;
};

export const deleteRoom = async (id: string): Promise<{ success: boolean }> => {
	return await api.delete(`/rooms/${id}`);
};
