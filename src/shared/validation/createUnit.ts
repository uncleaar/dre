import { ContactTypes } from "shared/constants";
import * as yup from "yup";

export const createUnitSchema = yup.object().shape({
	buildingId: yup.object().required("Building id is required"),
	unitName: yup.string().required("Unit name is required"),
	contacts: yup.array().of(
		yup.object().shape({
			contactId: yup.string(),
			contactType: yup.string().oneOf(Object.values(ContactTypes))
		})
	),
	unitRent: yup.number().required("Unit rent  is required"),
	status: yup.string(),
	lockboxType: yup.string().max(20),
	lockboxCode: yup.string().max(20),
	altUnitNumber: yup.string().max(10),
	SqrFt: yup.number().required(),
	keyArchiveNumber: yup.string(),
	floor: yup.number().integer(),
	specialPrice: yup.number().integer(),
	feePercentage: yup.number().integer()
});
