import { Amenity } from "./amenities";
import { Contact } from "./contact.ts";
import { Meta } from "./meta";
import { Utility } from "./utilities";

export interface Units {
	list: Unit[];
	meta: Meta;
}

export interface Unit {
	id: string;
	amenities: Amenity[];
	utilities: Utility[];
	unitName: string;
	buildingId: string;
	owners?: any[];
	status: string;
	useActualSqrFt: boolean;
	createdBy: string;
	updatedBy: string;
	contacts: any[];
	contactsData: Contact[];
	createdAt: string;
	updatedAt: string;
	SqrFt?: number;
	altUnitNumber?: string;
	availability?: string;
	feePercentage?: number;
	feeType?: string;
	floor?: number;
	forRent?: boolean;
	forSale?: boolean;
	hasLockbox?: boolean;
	haveKey?: boolean;
	inquiryAutoResponse?: string;
	keyArchiveNumber?: string;
	keyNote?: string;
	lockboxCode?: string;
	lockboxType?: string;
	notes?: string;
	numberOfFloors?: number;
	shiftingFeePrice?: string;
	specialPrice?: number;
	specialPriceNote?: string;
	unitNumber?: string;
	unitRent?: number;
	unitType?: string;
	rooms?: Room[];
	Availability?: string;
}

export interface Room {
	roomType: string;
	roomNumber: number;
	sqrFt: number;
	amenities: any[];
	notes: any[];
	availability: string;
	unitRent: number;
	shiftingFeePrice: string;
	specialPrice: number;
	specialPriceNote: string;
	feeType: string;
	feePercent: number;
}

export const UnitStatuses = {
	new: "new",
	available: "available",
	application: "application",
	deposited: "deposited",
	rented: "rented",
	onHold: "onHold",
	underConstructionCanShow: "underConstructionCanShow",
	underConstructionCantShow: "underConstructionCantShow"
} as const;
