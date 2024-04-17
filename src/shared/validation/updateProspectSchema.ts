import * as yup from "yup";

export const occupantSchema = yup.object().shape({
	name: yup.string().required(),
	phone: yup.string().required(),
	email: yup.string().required(),
	relationship: yup.string().required(),
	marketingEmails: yup.boolean().required(),
	notificationEmails: yup.boolean().required()
});

export const petTypeSchema = yup.object().shape({
	type: yup.string().required(),
	breed: yup.string().required(),
	weight: yup.number().required()
});

export const availabilitySchema = yup.object().shape({
	startTime: yup.date().required(),
	endTime: yup.date().required()
});

export const recurringPaymentSchema = yup.object().shape({
	name: yup.string().required(),
	email: yup.string().required(),
	phone: yup.string().required(),
	amount: yup.number().required(),
	start: yup.date().required(),
	end: yup.date().required(),
	interval: yup.number().required(),
	type: yup.string().required(),
	payee: yup.string().required(),
	ourNotes: yup.string().required()
});
