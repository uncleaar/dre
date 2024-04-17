import { useCallback, useEffect, useState } from "react";
import {
	getListingPublication,
	getListingPublicationConnectedContacts,
	updateListingPublication
} from "shared/api/listing-publications.ts";
import { createProspect } from "shared/api/prospects.ts";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages.ts";
import { combineContacts } from "shared/lib/combineContacts/combineContacts.ts";
import usePublicationStore from "shared/stores/publications/usePublicationStore.ts";

import { Box, Button, Flex, Paper, ScrollArea, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ContactsWithRole } from "../../../../../types/contacts.ts";
import { ListingPublication } from "../../../../../types/listing-publications-list.ts";

import styles from "./Prospects.module.scss";
export const CreateProspect = ({ onClose }: { onClose: () => void }) => {
	const { selectedPubTab } = usePublicationStore();
	const queryClient = useQueryClient();
	const [contacts, setContacts] = useState<ContactsWithRole[]>([]);
	const [relatedContacts, setRelatedContacts] = useState<ContactsWithRole[]>([]);
	const [selectContact, setSelectContact] = useState<string | undefined>(undefined);
	const { data: publication } = useQuery<ListingPublication>({
		queryKey: ["publications", selectedPubTab],
		queryFn: () =>
			getListingPublication(selectedPubTab as string, {
				contacts: true
			}),
		enabled: !!selectedPubTab
	});
	const { mutate } = useMutation({
		mutationKey: ["prospects"],
		mutationFn: async (data: { contactId: string }) =>
			await createProspect(selectedPubTab as string, data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["prospects"] });
			onClose();
			notifications.show({ title: "Success", message: "OK" });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while creating a prospect."
			});
		}
	});

	useEffect(() => {
		const getRelatedContacts = async () => {
			const data = await getListingPublicationConnectedContacts(selectedPubTab as string);
			if (data) {
				const combined = combineContacts(data.contactsData, data.contacts);
				setRelatedContacts(combined);
			}
		};
		if (selectedPubTab) {
			getRelatedContacts();
		}
	}, [selectedPubTab]);

	useEffect(() => {
		if (publication?.contacts?.length && publication?.contactsData?.length) {
			const combined = combineContacts(publication?.contactsData, publication?.contacts);
			setContacts(combined);
		}
	}, [publication]);

	const onSubmit = useCallback(() => {
		if (selectedPubTab && selectContact) {
			mutate({ contactId: selectContact });
		}
	}, [mutate, selectContact, selectedPubTab]);

	if (!selectedPubTab)
		return (
			<Flex justify="center">
				<Text>To create prospect please select publication.</Text>
			</Flex>
		);

	if (!contacts.length && !relatedContacts.length)
		return (
			<Flex justify="center">
				<Text>There are no contacts added yet.</Text>
			</Flex>
		);

	return (
		<Box>
			<ScrollArea h={400}>
				<Flex direction="column" gap={10}>
					{[...contacts, ...relatedContacts].map((contact) => (
						<Paper
							onClick={() => setSelectContact(contact.id)}
							shadow="xs"
							p="xl"
							radius="lg"
							className={styles.contact_box}
							classNames={{ ...(selectContact === contact.id ? { root: styles.root } : {}) }}
						>
							<Flex justify="space-between">
								<Text fw={600}>Name:</Text>
								<Text>
									{contact.firstName} {contact.lastName}
								</Text>
							</Flex>
							<Flex justify="space-between">
								<Text fw={600}>Email:</Text>
								<Text>{contact.email}</Text>
							</Flex>
							<Flex justify="space-between">
								<Text fw={600}>Contact Type:</Text>
								<Text>{contact.contactType}</Text>
							</Flex>
							<Flex justify="space-between">
								<Text fw={600}>Phone Number:</Text>
								<Text>{contact.phoneNumber}</Text>
							</Flex>
							<Flex justify="space-between">
								<Text fw={600}>Notes:</Text>
								<Text>{contact.notes}</Text>
							</Flex>
							<Flex justify="space-between">
								<Text fw={600}>Address For Notices:</Text>
								<Text>{contact.addressForNotices}</Text>
							</Flex>
						</Paper>
					))}
				</Flex>
			</ScrollArea>
			<Flex justify="center" my={16}>
				<Button disabled={!selectedPubTab || !selectContact} onClick={onSubmit}>
					Create
				</Button>
			</Flex>
		</Box>
	);
};
