import { Contact, ContactsRole } from "types/contacts.ts";
import { assert, test } from "vitest";

import { combineContacts } from "./combineContacts.ts";

test("combineContacts should correctly combine contact information with roles", () => {
	const infoArray: Contact[] = [
		{
			id: "1",
			firstName: "John",
			lastName: "Doe",
			phoneNumber: "1234567890",
			email: "john@example.com",
			addressForNotices: "123 Main St",
			notes: "Some notes",
			createdAt: "2022-01-01",
			updatedAt: "2022-01-02"
		},
		{
			firstName: "Jane",
			lastName: "Doe",
			phoneNumber: "9876543210",
			email: "jane@example.com",
			addressForNotices: "456 Oak St",
			notes: "Other notes",
			createdAt: "2022-01-03",
			updatedAt: "2022-01-04",
			id: "2"
		}
	];

	const rolesArray: ContactsRole[] = [
		{ contactId: "1", contactType: "manager" },
		{ contactId: "2", contactType: "tenant" }
	];

	const combinedContacts = combineContacts(infoArray, rolesArray);

	assert.equal(combinedContacts.length, 2);
	assert.equal(combinedContacts[0].id, "1");
	assert.equal(combinedContacts[0].contactType, "manager");
	assert.equal(combinedContacts[1].id, "2");
	assert.equal(combinedContacts[1].contactType, "tenant");
});

test("combineContacts should handle empty input arrays", () => {
	const combinedContacts = combineContacts([], []);

	assert.equal(combinedContacts.length, 0);
});

test("combineContacts should handle missing roles for some contacts", () => {
	const infoArray: Contact[] = [
		{
			firstName: "John",
			lastName: "Doe",
			phoneNumber: "1234567890",
			email: "john@example.com",
			addressForNotices: "123 Main St",
			notes: "Some notes",
			createdAt: "2022-01-01",
			updatedAt: "2022-01-02",
			id: "1"
		},
		{
			firstName: "Jane",
			lastName: "Doe",
			phoneNumber: "9876543210",
			email: "jane@example.com",
			addressForNotices: "456 Oak St",
			notes: "Other notes",
			createdAt: "2022-01-03",
			updatedAt: "2022-01-04",
			id: "2"
		}
	];

	const rolesArray: ContactsRole[] = [{ contactId: "1", contactType: "manager" }];

	const combinedContacts = combineContacts(infoArray, rolesArray);

	assert.equal(combinedContacts.length, 2);
	assert.equal(combinedContacts[0].id, "1");
	assert.equal(combinedContacts[0].contactType, "manager");
	assert.equal(combinedContacts[1].id, "2");
	assert.equal(combinedContacts[1].contactType, undefined); // Expect undefined for missing role
});
