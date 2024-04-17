import { Contact, ContactsRole, ContactsWithRole } from "types/contacts.ts";

export const combineContacts = (
	infoArray: Contact[],
	rolesArray: ContactsRole[]
): ContactsWithRole[] => {
	const rolesLookup = rolesArray.reduce((acc: any, role) => {
		acc[role.contactId] = role.contactType;
		return acc;
	}, {});

	return infoArray.map((contact) => ({
		...contact,
		contactType: rolesLookup[contact.id]
	}));
};
