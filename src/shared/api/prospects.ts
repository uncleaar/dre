import { Prospect, Prospects } from "../../types/prospects.ts";

import { api } from "./api";

export const createProspect = async (
	publicationId: string,
	data: { contactId: string }
): Promise<{ success: boolean }> => {
	const response = await api.post(`/prospects/${publicationId}`, data);
	return response.data;
};
export const updateProspect = async (
	prospectId: string,
	data: Partial<Omit<Prospect, "id">>
): Promise<{ success: boolean }> => {
	const response = await api.put(`/prospects/${prospectId}`, data);
	return response.data;
};
export const deleteProspect = async (prospectId: string): Promise<{ success: boolean }> => {
	const response = await api.delete(`/prospects/${prospectId}`);
	return response.data;
};
export const getProspectById = async (prospectId: string): Promise<Prospect> => {
	const response = await api.get(`/prospects/${prospectId}`);
	return response.data;
};

export const getProspectsByPublicationId = async (publicationId: string): Promise<Prospects> => {
	const response = await api.get(`/prospects/list/${publicationId}`);
	return response.data;
};
