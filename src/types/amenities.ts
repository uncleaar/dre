import { Meta } from "./meta";

export const AmenityCategories = {
	BUILDING: "Building amenity",
	UNIT: "Unit amenity"
} as const;

export interface Amenities {
	list: Amenity[];
	meta: Meta;
}

export interface Amenity {
	id: string;
	category: string;
	name: string;
	notes: string;
	icon: string;
}
