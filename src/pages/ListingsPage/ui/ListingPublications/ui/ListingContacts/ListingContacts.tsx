import _ from "lodash";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
	getListingPublicationConnectedContacts,
	updateListingPublication
} from "shared/api/listing-publications";
import { getContacts } from "shared/api/settings";
import { ContactTypes } from "shared/constants";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { combineContacts } from "shared/lib/combineContacts/combineContacts.ts";
import { Contact, ContactsRole, ContactsWithRole } from "types/contacts";
import { ListingPublication } from "types/listing-publications-list";
import { AsyncSelect } from "widgets/Select";

import { ScrollArea } from "@mantine/core";
import {
	Box,
	Button,
	Divider,
	Flex,
	InputWrapper,
	Modal,
	Select,
	Table,
	Text
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import styles from "../../ListingPublications.module.scss";

interface ListingContactsProps {
	listingId: string;
	contacts?: ContactsRole[];
	contactsData?: Contact[];
}
export const ListingContacts: FC<ListingContactsProps> = ({
	listingId,
	contacts,
	contactsData
}) => {
	const [opened, { open, close }] = useDisclosure(false);
	const [tableData, setTableData] = useState<ContactsWithRole[]>([]);
	const [relatedContacts, setRelatedContacts] = useState<ContactsWithRole[]>([]);
	const [newContacts, setNewContacts] = useState<any>([]);
	const [isUnselected, setIsUnselected] = useState(false);
	const [openedContacts, setOpenedContacts] = useState<string[]>([]);
	const [, { toggle }] = useDisclosure(true);
	const queryClient = useQueryClient();

	const toggleContact = (id: string): void => {
		let contacts;
		if (openedContacts.includes(id)) {
			contacts = openedContacts.filter((item) => item !== id);
		} else {
			contacts = openedContacts.concat([id]);
		}
		setOpenedContacts(contacts);
		toggle();
	};

	useEffect(() => {
		if (isUnselected) {
			setTimeout(() => {
				setIsUnselected(false);
			}, 2000);
		}
	}, [isUnselected]);

	useEffect(() => {
		const getRelatedContacts = async () => {
			const data = await getListingPublicationConnectedContacts(listingId);
			if (data) {
				const combined = combineContacts(data.contactsData, data.contacts);
				setRelatedContacts(combined);
			}
		};
		getRelatedContacts();
	}, [listingId]);

	const { mutate } = useMutation({
		mutationKey: ["publications"],
		mutationFn: async (data: Partial<ListingPublication>) =>
			await updateListingPublication(data, listingId as string),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["publications"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.publication_update });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while updating the building."
			});
		}
	});

	useEffect(() => {
		if (contacts?.length && contactsData?.length) {
			const combined = combineContacts(contactsData, contacts);
			setTableData(combined);
		}
	}, [contacts, contactsData]);

	const onChange = (values: any) => {
		setNewContacts(
			values.map((item: Contact) => ({
				value: item.id,
				label: item.firstName,
				...item
			}))
		);
	};

	const contactTypes: string[] = useMemo(() => {
		return Object.keys(ContactTypes);
	}, []);

	const handleSelectRole = (value: any, id: string) => {
		setNewContacts((prev: any) => {
			return prev.map((item: { id: string; value: string }) => {
				if (item.id === id) {
					return {
						...item,
						contactType: value
					};
				}
				return item;
			});
		});
	};

	const onClose = () => {
		setNewContacts([]);
		close();
	};

	const onSubmit = () => {
		let data = newContacts.filter((contact: ContactsWithRole) => contact.contactType);
		if (newContacts.length !== data.length) {
			setIsUnselected(true);
			return;
		}
		data = data.map((item: ContactsWithRole) => ({
			contactId: item.id,
			contactType: item.contactType
		}));

		const combinedData = [...data];

		contacts?.forEach((contact) => {
			const isNotExist = combinedData.some((item) => item.contactId === contact.contactId);
			if (!isNotExist) {
				combinedData.push(contact);
			}
		});
		mutate({ contacts: combinedData });
		onClose();
	};
	const onDelete = (id: string) => {
		if (contacts?.length) {
			const result = contacts.filter((item) => item.contactId !== id);
			mutate({ contacts: result });
		}
	};
	return (
		<div>
			<Button my={10} onClick={open}>
				Add contact
			</Button>
			<Modal opened={opened} onClose={onClose} size="35%">
				<Box h={500}>
					<InputWrapper description="Contacts" className={styles.label}>
						<AsyncSelect<Contact>
							entityName="contacts"
							getEntity={getContacts}
							valueKey="id"
							labelKey={["firstName", "lastName"]}
							onChange={onChange}
							defaultValue={newContacts}
							isMulti={true}
						/>
					</InputWrapper>
					<Divider my="sm" />
					<Box>
						{!newContacts.length ? null : (
							<>
								{newContacts.map((item: ContactsWithRole) => {
									return (
										<Flex key={item.id} justify="space-between" mb={5}>
											<p>
												{item.firstName} {item.lastName}
											</p>
											<Select
												size="xs"
												placeholder="Select role"
												data={contactTypes}
												onChange={(value) => handleSelectRole(value, item.id)}
											/>
										</Flex>
									);
								})}
							</>
						)}
					</Box>
				</Box>
				<Flex justify="center">
					<Text c="red" fw={500}>
						{isUnselected ? "Please select a role for contact." : ""}
					</Text>
				</Flex>
				<Flex justify="flex-end">
					<Button onClick={onSubmit}>Add</Button>
				</Flex>
			</Modal>

			<Table withTableBorder>
				<Table.Tbody>
					<ScrollArea h={tableData?.length || relatedContacts?.length ? 400 : 0}>
						{tableData.length
							? tableData.map((element) => (
									<Table.Tr key={_.uniqueId("contact_")}>
										<Table.Td>
											<Table withColumnBorders style={{ backgroundColor: "#F8F9FA" }}>
												<Table.Tbody>
													<Table.Tr>
														<Table.Td w="50%">Name</Table.Td>
														<Table.Td w="40%">
															{element.firstName} {element.lastName}
															<Button
																variant="default"
																size="xs"
																mr={24}
																ml={36}
																onClick={() => onDelete(element.id)}
															>
																X
															</Button>
														</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td w="50%">Email</Table.Td>
														<Table.Td w="50%">{element.email}</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>Contact Type</Table.Td>
														<Table.Td>{element.contactType}</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>Phone Number</Table.Td>
														<Table.Td>{element.phoneNumber}</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>Address</Table.Td>
														<Table.Td>{element.addressForNotices}</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>Notes</Table.Td>
														<Table.Td>{element.notes}</Table.Td>
													</Table.Tr>
												</Table.Tbody>
											</Table>
										</Table.Td>
									</Table.Tr>
								))
							: null}
						{relatedContacts.length
							? relatedContacts.map((element, i) => (
									<Table.Tr key={_.uniqueId(`contact_${i}_`)}>
										<Table.Td>
											<Table withColumnBorders style={{ backgroundColor: "#F8F9FA" }}>
												<Table.Tbody>
													<Table.Tr>
														<Table.Td w="50%">Name</Table.Td>
														<Table.Td w="50%">
															{element.firstName} {element.lastName}
														</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td w="50%">Email</Table.Td>
														<Table.Td w="50%">{element.email}</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>Contact Type</Table.Td>
														<Table.Td>{element.contactType}</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>Phone Number</Table.Td>
														<Table.Td>{element.phoneNumber}</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>Address</Table.Td>
														<Table.Td>{element.addressForNotices}</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>Notes</Table.Td>
														<Table.Td>{element.notes}</Table.Td>
													</Table.Tr>
												</Table.Tbody>
											</Table>
										</Table.Td>
									</Table.Tr>
								))
							: null}
					</ScrollArea>
				</Table.Tbody>
			</Table>
		</div>
	);
};
