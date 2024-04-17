import { Params } from "shared/api/users";

import { Appointment, Appointments } from "../../types/appointments.ts";

import { api } from "./api";

interface GetAppointmentsParams extends Params {}
export const createAppointment = async (
	data: Omit<Appointment, "id">
): Promise<{ success: boolean }> => {
	const response = await api.post(`/appointments`, data);
	return response.data;
};
export const getAppointmentById = async (id: string): Promise<Appointment> => {
	const response = await api.get(`/appointments/${id}`);
	return response.data;
};
export const getAppointments = async ({
	page,
	perPage,
	sortBy,
	sortOrder,
	search
}: GetAppointmentsParams): Promise<Appointments> => {
	const response = await api.get(`/appointments`, {
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
export const updateAppointment = async (
	data: Partial<Appointment>,
	id: string
): Promise<{ success: boolean }> => {
	const response = await api.patch(`/appointments/${id}`, data);
	return response.data;
};
export const deleteAppointment = async (id: string): Promise<{ success: boolean }> => {
	const response = await api.delete(`/appointments/${id}`);
	return response.data;
};
