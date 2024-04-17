import React, { FC, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { getContacts } from "shared/api/settings";
import { ContactTypes } from "shared/constants";
import { combineContacts } from "shared/lib/combineContacts/combineContacts.ts";
import { Contact } from "types/contacts";
import { AsyncSelect } from "widgets/Select";

import {
	Box,
	Button,
	Collapse,
	Divider,
	Flex,
	List,
	rem,
	Select,
	Text,
	ThemeIcon,
	Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { IconCircleCheck, IconCircleDashed } from "@tabler/icons-react";

import styles from "./BuildingContacts.module.scss";

interface BuildingContactsProps {
	open: () => void;
}

export const BuildingContacts: FC<BuildingContactsProps> = ({ open }) => {
	const [openedContactBox, { toggle: toggleContactBox }] = useDisclosure(true);
	const [defaultValue, setDefaultValue] = useState<any>([]);
	const {
		setValue,
		formState: { defaultValues }
	} = useFormContext();

	useEffect(() => {
		if (defaultValues?.contactsData && defaultValues?.contacts) {
			const combined = combineContacts(defaultValues?.contactsData, defaultValues?.contacts);
			setDefaultValue(
				combined.map((item: any) => {
					return {
						value: item.id,
						label: item.firstName,
						...item
					};
				})
			);
		}
	}, [defaultValues?.contactsData]);

	const contactTypes: string[] = useMemo(() => {
		return Object.keys(ContactTypes);
	}, []);

	const onChange = (values: any) => {
		setDefaultValue(
			values.map((item: Contact) => ({
				value: item.id,
				label: item.firstName,
				...item
			}))
		);
	};
	const handleSelectRole = (value: any, id: string) => {
		setDefaultValue((prev: any) => {
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

	useEffect(() => {
		const data = defaultValue
			.filter((item: any) => item.contactType)
			.map((item: any) => ({
				contactId: item.id,
				contactType: item.contactType
			}));
		setValue("contacts", data);
	}, [defaultValue]);

	return (
		<Box>
			<Flex justify="space-between">
				<Title className={styles.title} order={5}>
					CONTACTS
				</Title>
				{openedContactBox ? (
					<IconArrowUp className={styles.pointer} onClick={toggleContactBox} />
				) : (
					<IconArrowDown className={styles.pointer} onClick={toggleContactBox} />
				)}
			</Flex>
			<Collapse in={openedContactBox} transitionDuration={500} transitionTimingFunction="linear">
				<Flex justify="flex-end">
					<Button classNames={{ root: styles.margin_bottom }} onClick={open} color="teal">
						CREATE CONTACT
					</Button>
				</Flex>
				<Divider my="sm" />
				<AsyncSelect<Contact>
					entityName="contacts"
					getEntity={getContacts}
					valueKey="id"
					labelKey={["firstName", "lastName"]}
					onChange={onChange}
					defaultValue={defaultValue}
					isMulti={true}
				/>
				<Divider my="sm" />
				<Box>
					{defaultValue?.length ? (
						<List>
							{defaultValue.map((item: any, i: number) => (
								<List.Item
									key={item.id}
									icon={
										<ThemeIcon color={item.contactType ? "teal" : "blue"} size={24} radius="xl">
											{item.contactType ? (
												<IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
											) : (
												<IconCircleDashed style={{ width: rem(16), height: rem(16) }} />
											)}
										</ThemeIcon>
									}
									classNames={{
										itemLabel: styles.list_item_label,
										itemWrapper: styles.list_item_wrapper
									}}
								>
									<Flex justify="space-between">
										<Text>
											{i + 1}.{item?.firstName} {item?.lastName} {item?.phoneNumber}
										</Text>
										<Select
											size="xs"
											placeholder="Select role"
											data={contactTypes}
											defaultValue={item.contactType || ""}
											onChange={(value) => handleSelectRole(value, item.id)}
										/>
									</Flex>
								</List.Item>
							))}
						</List>
					) : (
						<p>There are no selected contacts yet</p>
					)}
				</Box>
			</Collapse>
		</Box>
	);
};
