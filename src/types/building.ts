import { ContactTypes } from "shared/constants";

import { Amenity } from "./amenities";
import { Contact, ContactsRole } from "./contacts";
import { Meta } from "./meta";
import { Unit } from "./unit.ts";
import { Utility } from "./utilities";

export interface Buildings {
	list: Building[];
	meta: Meta;
}

export interface Building {
	id: string;
	name: string;
	buildingType: string;
	description: string;
	totalUnits: number;
	address: Address;
	occupancyStatus: keyof typeof BuildingStatuses;
	photoGallery: string[];
	buildingFacts: BuildingFacts;
	includedUtilities: string[];
	petsPolicy: PetsPolicy;
	contacts: ContactsRole[];
	amenities: string[] | Amenity[];
	utilities: string[] | Utility[];
	feedbacks: string[];
	units?: Unit[];
	contactsData?: Contact[];
	activate: boolean;
	slug: string;
	__v: number;
}

export interface PetsPolicy {
	dogs: keyof typeof PetPolicyAllowance;
	cats: keyof typeof PetPolicyAllowance;
	smallPets: keyof typeof PetPolicyAllowance;
	noPets: keyof typeof PetPolicyAllowance;
	petsOnApproval: string;
}

export interface BuildingFacts {
	buildingOverview: BuildingOverview;
	sizeAndDimensions: SizeAndDimensions;
	districts: Districts;
	_id: string;
}

export interface Districts {
	community_district: number;
	police_precinct: number;
	school_district: number;
	city_council: number;
	fire_department: string;
	_id: string;
}

export interface SizeAndDimensions {
	units: number;
	stories: number;
	building_Sq_Ft: string;
	lot_Sq_Ft: string;
	building_depth: string;
	_id: string;
}

export interface BuildingOverview {
	property_type: string;
	year_built: number;
	building_class: string;
	owner: string;
	_id: string;
}

export interface Address {
	country: string;
	state: string;
	city: string;
	borough: string;
	neighborhood: string;
	address: string;
	advertisingAddress: string;
	zip: string;
	longitude: number;
	latitude: number;
	advertisingLongitude: number;
	advertisingLatitude: number;
	note: string;
	meetingPlace: string;
	crossStreet: string;
	_id: string;
}

export const BuildingStatuses = {
	new: "new",
	vacant: "vacant",
	partially: "partially",
	occupied: "occupied",
	fullyOccupied: "fullyOccupied"
} as const;

export const PetPolicyAllowance = {
	allowed: "allowed",
	notAllowed: "notAllowed"
} as const;

export interface FormValues {
	name: string;
	buildingType: string;
	description: string;
	occupancyStatus: keyof typeof BuildingStatuses;
	activate: boolean;
	feedbacks: string[];
	//contacts
	contacts: {
		contactId: string;
		contactType: keyof typeof ContactTypes;
	}[];
	//overview
	property_type: string;
	year_built: number;
	building_class: string;
	owner: string;
	totalUnits: number;
	//size
	units: number;
	stories: number;
	building_Sq_Ft: string;
	lot_Sq_Ft: string;
	building_depth: string;
	//districts
	community_district: number;
	police_precinct: number;
	school_district: number;
	city_council: number;
	fire_department: string;
	//amenities
	amenities: string[];
	//utilities
	utilities: string[];
	//pet policy
	dogs: string;
	cats: string;
	smallPets: string;
	noPets: string;
	petsOnApproval: string;
	//address
	county: string;
	state: string;
	city: string;
	borough: string;
	neighborhood: string;
	address: string;
	advertisingAddress: string;
	zip: string;
	longitude: number;
	latitude: number;
	advertisingLongitude: number;
	advertisingLatitude: number;
	note: string;
	meetingPlace: string;
	crossStreet: string;
}
