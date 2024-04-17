import { Meta } from "./meta.ts";

interface Listings {
	list: Listing[];
	meta: Meta;
}

interface Listing {
	id: string;
	humanReadableId: string;
	createdBy: string;
	status: string;
	entities: string[];
	notes: string[];
	createdAt: string;
	updatedAt: string;
	landlords?: string[];
}
