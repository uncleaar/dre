import { Params } from "shared/api/users";
import { Unit, Units, UnitStatuses } from "types/unit";

import { api } from "./api";

interface GetUnitsParams extends Params {
	buildingId: string[];
	status?: string[];
}

export interface UpdateUnitStatusProps {
	status: keyof typeof UnitStatuses;
}

export const getUnits = async ({
	page,
	perPage,
	sortBy,
	sortOrder,
	search,
	buildingId = [],
	status
}: GetUnitsParams): Promise<Units> => {
	const response = await api.get<Units>(`/units`, {
		params: {
			page,
			perPage,
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {}),
			buildingId,
			...(status?.length ? { status } : {})
		}
	});
	return response.data as Units;
};

export const createUnitById = async (
	buildingId: string,
	data: { unitName: string }
): Promise<Unit> => {
	const response = await api.post<Unit>(`/units/${buildingId}`, data);
	return response.data as Unit;
};

export const updateUnit = async (data: Unit, id: string): Promise<{ success: boolean }> => {
	const response = await api.put(`/units/${id}`, data);
	return { success: response.data };
};

export const updateUnitStatus = async (
	data: UpdateUnitStatusProps,
	id: string
): Promise<{ success: boolean }> => {
	const response = await api.put(`/units/${id}/status`, data);
	return { success: response.data };
};

export const getUnit = async (
	unitId: string,
	{
		contacts,
		amenities,
		utilities
	}: { contacts?: boolean; amenities?: boolean; utilities?: boolean }
): Promise<Unit> => {
	const response = await api.get(`/units/${unitId}`, {
		params: {
			...(contacts ? { contacts } : {}),
			...(amenities ? { amenities } : {}),
			...(utilities ? { utilities } : {})
		}
	});

	return response.data;
};

export const deleteUnit = async (unitId: string): Promise<{ success: boolean }> => {
	return await api.delete(`/units/${unitId}`);
};
