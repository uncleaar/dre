import { api } from "shared/api/api";
import { Params } from "shared/api/users";
import { Amenities, Amenity } from "types/amenities";
import { Contact } from "types/contact";
import { Contacts } from "types/contacts";
import { Utilities, Utility } from "types/utilities";

export const getContacts = async ({
	page,
	perPage,
	sortBy,
	sortOrder,
	search
}: Params): Promise<Contacts> => {
	const response = await api.get<Contacts>(`/contacts`, {
		params: {
			page,
			perPage,
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {})
		}
	});
	return response.data as Contacts;
};

export const getContactById = async (id: string): Promise<Contact> => {
	const response = await api.get(`/contacts/${id}`);

	return response.data;
};

export const deleteContact = async (id: string): Promise<{ success: boolean }> => {
	return await api.delete(`/contacts/${id}`);
};

export const createContact = async (data: Contact): Promise<{ success: boolean }> => {
	return await api.post(`/contacts`, data);
};

export const updateContact = async (data: Contact, id: string): Promise<{ success: boolean }> => {
	const response = await api.patch(`/contacts/${id}`, data);
	return response.data;
};

export const getAmenities = async ({
	page,
	perPage,
	sortBy,
	sortOrder,
	search
}: Params): Promise<Amenities> => {
	const response = await api.get(`/amenity`, {
		params: {
			...(page ? { page } : {}),
			...(perPage ? { perPage } : {}),
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {})
		}
	});
	return response.data as Amenities;
};

export const getAmenityById = async (id: string): Promise<Amenity> => {
	const response = await api.get(`/amenity/${id}`);

	return response.data;
};

export const deleteAmenity = async (id: string): Promise<{ success: boolean }> => {
	return await api.delete(`/amenity/${id}`);
};

export const createAmenity = async (data: Amenity): Promise<{ success: boolean }> => {
	const response = await api.post(`/amenity`, data);
	return response.data;
};

export const updateAmenity = async (data: Amenity, id: string): Promise<{ success: boolean }> => {
	const response = await api.patch(`/amenity/${id}`, data);
	return response.data;
};

export const getUtilities = async ({
	page,
	perPage,
	sortBy,
	sortOrder,
	search
}: Params): Promise<Utilities> => {
	const response = await api.get(`/utility`, {
		params: {
			...(page ? { page } : {}),
			...(perPage ? { perPage } : {}),
			...(search ? { search } : {}),
			...(sortBy ? { sortBy } : {}),
			...(sortOrder ? { sortOrder } : {})
		}
	});
	return response.data;
};

export const createUtility = async (data: Utility): Promise<{ success: boolean }> => {
	const response = await api.post(`/utility`, data);
	return response.data;
};

export const updateUtility = async (data: Utility, id: string): Promise<{ success: boolean }> => {
	const response = await api.patch(`/utility/${id}`, data);
	return response.data;
};

export const deleteUtility = async (id: string): Promise<{ success: boolean }> => {
	return await api.delete(`/utility/${id}`);
};

export const getUtilityById = async (id: string): Promise<Utility> => {
	const response = await api.get(`/utility/${id}`);

	return response.data;
};
