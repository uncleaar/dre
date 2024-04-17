import * as yup from "yup";

export const createUserSchema = yup.object().shape({
	email: yup.string().email().required("email is required"),
	firstName: yup.string().required("first name is required"),
	lastName: yup.string().required("last name is required"),
	role: yup.string().required("role is required"),
	permissionsSet: yup.string().notRequired(),
	password: yup
		.string()
		.required("No password provided.")
		.min(8, "Password is too short - should be 8 chars minimum.")
		.matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
});
