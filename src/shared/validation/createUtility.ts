import * as yup from "yup";

export const createUtilitySchema = yup.object().shape({
	name: yup.string().required(),
	notes: yup.string().required(),
	icon: yup.string().required()
});
