import { FeeTypes, RoomStatuses, RoomTypes } from "shared/constants/rooms/room-constants.ts";

import { Amenity } from "./amenities";
import { Contact, ContactsRole } from "./contacts";
import { Meta } from "./meta";

export interface Rooms {
	list: Room[];
	meta: Meta;
}

export interface Room {
	id: string;
	unitId: string;
	status: keyof typeof RoomStatuses;
	roomType: keyof typeof RoomTypes;
	roomNumber: number;
	sqrFt: number;
	amenities: string[] | Amenity[];
	notes: string[];
	availability: Date;
	unitRent: number;
	shiftingFeePrice: string;
	specialPrice: number;
	specialPriceNote: string;
	feeType: keyof typeof FeeTypes;
	feePercent: number;
	createdBy: string;
	updatedBy: string;
	contacts: ContactsRole[];
	contactsData?: Contact[];
}

export interface FormValues {
	status?: keyof typeof RoomStatuses;
	roomType: keyof typeof RoomTypes;
	roomNumber?: number;
	sqrFt?: number;
	amenities?: (Amenity & { value: string; label: string })[];
	notes?: string[];
	availability?: Date;
	unitRent?: number;
	shiftingFeePrice?: string;
	specialPrice?: number;
	specialPriceNote?: string;
	feeType?: keyof typeof FeeTypes;
	feePercent?: number;
	contacts?: ContactsRole[];
}
