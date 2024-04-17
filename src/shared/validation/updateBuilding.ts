import { ContactTypes } from "shared/constants";
import { USStates } from "shared/constants/us-states";
import * as yup from "yup";

import { BuildingStatuses, PetPolicyAllowance } from "../../types/building";

export const updateBuildingSchema = yup.object().shape({
	name: yup.string().required(),
	buildingType: yup.string(),
	buildingDescription: yup.string(),
	occupancyStatus: yup.string().oneOf(Object.values(BuildingStatuses)),
	activate: yup.boolean(),
	feedbacks: yup.array().of(yup.string()),
	contacts: yup.array().of(
		yup.object().shape({
			contactId: yup.string(),
			contactType: yup.string().oneOf(Object.values(ContactTypes))
		})
	),
	//overview
	property_type: yup.string(),
	year_built: yup.number(),
	building_class: yup.string(),
	owner: yup.string(),
	//size
	units: yup.number(),
	stories: yup.number(),
	building_Sq_Ft: yup.string(),
	lot_Sq_Ft: yup.string(),
	building_depth: yup.string(),
	//districts
	community_district: yup.number(),
	police_precinct: yup.number(),
	school_district: yup.number(),
	city_council: yup.number(),
	fire_department: yup.string(),
	//pet policy
	dogs: yup.string().oneOf(Object.values(PetPolicyAllowance)),
	cats: yup.string().oneOf(Object.values(PetPolicyAllowance)),
	smallPets: yup.string().oneOf(Object.values(PetPolicyAllowance)),
	noPets: yup.string().oneOf(Object.values(PetPolicyAllowance)),
	petsOnApproval: yup.string(),
	//address
	address: yup.string().max(100),
	state: yup.string().oneOf(Object.values(USStates)),
	advertisingAddress: yup.string().max(100),
	city: yup.string().max(50),
	zip: yup.string(),
	country: yup.string(),
	borough: yup.string().max(50),
	neighborhood: yup.string().max(50),
	latitude: yup.number().min(-90).max(90),
	longitude: yup.number().min(-180).max(180),
	advertisingLongitude: yup.number().min(-180).max(180),
	advertisingLatitude: yup.number().min(-90).max(90),
	meetingPlace: yup.string(),
	crossStreet: yup.string(),
	note: yup.string()
});
