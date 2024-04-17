import * as yup from "yup";

export const createAmenitySchema = yup.object().shape({
	category: yup.string().required(),
	name: yup.string().required(),
	notes: yup.string(),
	icon: yup.string()
});
