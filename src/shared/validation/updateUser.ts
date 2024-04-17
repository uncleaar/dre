import * as yup from "yup";

export const updateUserSchema = yup.object().shape({
	email: yup.string().email().required("email is required"),
	firstName: yup.string().required("first name is required"),
	lastName: yup.string().required("last name is required"),
	role: yup.string().required("role is required"),
	permissionsSet: yup.string().required("Permissions Set is required"),
	password: yup
		.string()
		.notRequired()
		.min(8, "Password is too short - should be 8 chars minimum.")
		.matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
});
