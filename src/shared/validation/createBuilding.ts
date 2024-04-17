import * as yup from "yup";

export const createBuildingSchema = yup.object().shape({
	name: yup.string().required()
});
