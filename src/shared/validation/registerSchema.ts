import * as yup from "yup";

export const registerSchema = yup.object().shape({
	email: yup.string().email().required("email is required"),
	password: yup
		.string()
		.required("No password provided.")
		.min(8, "Password is too short - should be 8 chars minimum.")
		.matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
	firstName: yup.string().required("first name is required"),
	lastName: yup.string().required("last name is required")
});
