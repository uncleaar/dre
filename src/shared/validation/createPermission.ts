import * as yup from "yup";

export const createPermissionSchema = yup.object().shape({
	name: yup.string().required("name is required"),
	description: yup.string().required("description is required")
});
