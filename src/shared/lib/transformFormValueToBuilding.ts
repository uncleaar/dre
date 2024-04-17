import { Building, FormValues } from "../../types/building";

export const transformFormValuesToBuilding = (formData: FormValues): Building => {
	const mainFields = [
		"name",
		"buildingType",
		"description",
		"occupancyStatus",
		"activate",
		"feedbacks",
		"contacts",
		"amenities",
		"utilities",
		"totalUnits"
	];
	const petPolicyFields = ["dogs", "cats", "smallPets", "smallPets", "noPets", "petsOnApproval"];
	const overviewFields = ["property_type", "year_built", "building_class", "owner"];
	const dimensionsFields = ["stories", "building_Sq_Ft", "lot_Sq_Ft", "building_depth", "units"];
	const districtsFields = [
		"community_district",
		"police_precinct",
		"school_district",
		"city_council",
		"fire_department"
	];
	const addressFields = [
		"address",
		"advertisingAddress",
		"neighborhood",
		"state",
		"city",
		"zip",
		"country",
		"borough",
		"latitude",
		"longitude",
		"advertisingLatitude",
		"advertisingLongitude",
		"meetingPlace",
		"crossStreet",
		"note"
	];

	const transformedData: any = {};
	const petsPolicy: any = {};
	const buildingOverview: any = {};
	const sizeAndDimensions: any = {};
	const districts: any = {};
	const buildingFacts: any = {};
	const address: any = {};

	for (const field of mainFields) {
		if (formData[field as keyof FormValues]) {
			if (field === "amenities" || field === "utilities") {
				transformedData[field] = formData[field].map((item: any) => item.id);
			} else {
				transformedData[field] = formData[field as keyof FormValues];
			}
		}
	}
	for (const field of addressFields) {
		if (formData[field as keyof FormValues]) {
			address[field] = formData[field as keyof FormValues];
		}
	}
	for (const field of petPolicyFields) {
		if (formData[field as keyof FormValues]) {
			petsPolicy[field] = formData[field as keyof FormValues];
		}
	}
	for (const field of overviewFields) {
		if (formData[field as keyof FormValues]) {
			buildingOverview[field] = formData[field as keyof FormValues];
		}
	}
	for (const field of dimensionsFields) {
		if (formData[field as keyof FormValues]) {
			sizeAndDimensions[field] = formData[field as keyof FormValues];
		}
	}
	for (const field of districtsFields) {
		if (formData[field as keyof FormValues]) {
			districts[field] = formData[field as keyof FormValues];
		}
	}

	if (Object.keys(petPolicyFields).length) {
		transformedData["petsPolicy"] = petsPolicy;
	}
	buildingFacts["buildingOverview"] = buildingOverview;
	buildingFacts["sizeAndDimensions"] = sizeAndDimensions;
	buildingFacts["districts"] = districts;
	transformedData["address"] = address;
	transformedData["buildingFacts"] = buildingFacts;
	return transformedData;
};
