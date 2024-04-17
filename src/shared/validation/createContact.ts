import * as yup from "yup";

export const createContactSchema = yup.object().shape({
	firstName: yup.string().required("first name is required"),
	lastName: yup.string().required("last name is required"),
	phoneNumber: yup.string().required("phone number is required"),
	email: yup.string().email().required("email is required"),
	addressForNotices: yup.string().required("address for notices is required"),
	notes: yup.string().required("notes is required")
});
