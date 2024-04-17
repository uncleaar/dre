import * as yup from "yup";

export const createContactSchema = yup.object().shape({
	firstName: yup.string(),
	lastName: yup.string(),
	phoneNumber: yup.string(),
	email: yup.string().email(),
	addressForNotices: yup.string(),
	notes: yup.string()
});
