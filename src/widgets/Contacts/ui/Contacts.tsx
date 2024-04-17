import React, { FC, useCallback, useState } from "react";
import { ContactsWithRole } from "types/contacts";

import { Box, Collapse, Flex, List, ScrollArea, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

import styles from "./Contacts.module.scss";

interface ContactsProps {
	contacts?: ContactsWithRole[];
	scrollHeight?: number;
}

export const Contacts: FC<ContactsProps> = ({ contacts, scrollHeight = 800 }: ContactsProps) => {
	const [, { toggle }] = useDisclosure(true);

	const [openedContacts, setOpenedContacts] = useState<string[]>([]);

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

	const opened = useCallback(
		(id: string): boolean => {
			return openedContacts.includes(id);
		},
		[openedContacts]
	);

	return (
		<Box className={styles.box}>
			<ScrollArea h={scrollHeight}>
				{!contacts || !contacts.length ? (
					<p>No contacts have been added yet.</p>
				) : (
					<List>
						{contacts.map((item, i) => {
							return (
								<List.Item
									classNames={{
										item: styles.item_root,
										itemLabel: styles.item_label,
										itemWrapper: styles.item_wrapper
									}}
									key={item.id}
									onClick={() => toggleContact(item.id)}
								>
									<Flex justify="space-between" className={styles.flex}>
										<Text fw={700} size="md">
											{item.firstName} {item.lastName}
										</Text>
										{opened(item.id) ? (
											<IconArrowUp className={styles.pointer} />
										) : (
											<IconArrowDown className={styles.pointer} />
										)}
									</Flex>
									<Collapse in={opened(item.id)}>
										<Box className={styles.box}>
											<Flex justify="space-between">
												<Text fw={600} size="md">
													Contact Full Name:
												</Text>
												<Text>
													{item.firstName} {item.lastName}
												</Text>
											</Flex>
											<Flex justify="space-between">
												<Text fw={600} size="md">
													Email:
												</Text>
												<Text>{item.email}</Text>
											</Flex>
											<Flex justify="space-between">
												<Text fw={600} size="md">
													Role:
												</Text>
												<Text>{item.contactType}</Text>
											</Flex>
											<Flex justify="space-between">
												<Text fw={600} size="md">
													Phone Number:
												</Text>
												<Text>{item.phoneNumber}</Text>
											</Flex>
											<Flex justify="space-between">
												<Text fw={600} size="md">
													Address:
												</Text>
												<Text>{item.addressForNotices}</Text>
											</Flex>
										</Box>
									</Collapse>
								</List.Item>
							);
						})}
					</List>
				)}
			</ScrollArea>
		</Box>
	);
};
