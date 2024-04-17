import { FeeTypes } from "shared/constants";
import {
	PetsTypes,
	ProspectInquiryManagerPriority,
	ProspectProfileTypes
} from "shared/constants/prospects/prospect-constants.ts";

import { ContactsWithRole } from "./contacts.ts";
import { Meta } from "./meta.ts";

export interface Occupant {
	name: string;
	phone: string;
	email: string;
	relationship: string;
	marketingEmails: boolean;
	notificationEmails: boolean;
}

export interface PetType {
	type: keyof typeof PetsTypes;
	breed: string;
	weight: number;
}

export interface AvailabilityRecord {
	startTime: Date;
	endTime: Date;
}

export interface RecurringPayment {
	name: string;
	email: string;
	phone: string;
	amount: number;
	start: Date;
	end: Date;
	interval: number;
	type: string;
	payee: string;
	ourNotes: string;
}

export interface Prospect {
	id: string;
	contactId: string;
	profileType?: keyof typeof ProspectProfileTypes;
	leadSource?: string;
	marketingEmails?: boolean;
	notificationEmails?: boolean;
	markAsEmailed?: boolean;
	inquiryManagerPriority?: keyof typeof ProspectInquiryManagerPriority;
	inquiryAutoResponse?: boolean;
	SMSConfirmations?: boolean;
	occupants?: Occupant[];
	pets?: PetType[];
	bedrooms?: number;
	bathrooms?: number;
	feeType?: keyof typeof FeeTypes;
	maxWalkup?: number;
	minPrice?: number;
	maxPrice?: number;
	moveInEarly?: Date;
	moveInLate?: Date;
	minSqft?: number;
	maxSqft?: number;
	income?: number;
	credit?: number;
	notes?: string;
	neighborhoods?: string[];
	availability?: AvailabilityRecord[];
	amenities?: string[];
	currentAddress?: string;
	leaseEndDate?: Date;
	currentRent?: number;
	createdAt: string;
	updatedAt: string;
	recurringPayments?: RecurringPayment[];
	contact: ContactsWithRole[];
}

export interface Prospects {
	meta: Meta;
	list: Prospect[];
}
