import { ContactTypes } from "shared/constants";

import { Meta } from "./meta";

export interface Contacts {
	list: Contact[];
	meta: Meta;
}

export interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	addressForNotices: string;
	notes: string;
	createdAt: string;
	updatedAt: string;
}

export interface ContactsWithRole {
	id: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	addressForNotices: string;
	notes: string;
	contactType: keyof typeof ContactTypes;
	createdAt: string;
	updatedAt: string;
}

export interface ContactsRole {
	contactId: string;
	contactType: keyof typeof ContactTypes;
	_id?: string;
}
