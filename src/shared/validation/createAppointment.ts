import * as yup from "yup";

export const createAppointmentSchema = yup.object().shape({
	userId: yup.string().required(),
	reason: yup.string(),
	date: yup.string().required(),
	time: yup.string().required(),
	type: yup.string(),
	meetingPlace: yup.string().required(),
	notes: yup.string()
});
