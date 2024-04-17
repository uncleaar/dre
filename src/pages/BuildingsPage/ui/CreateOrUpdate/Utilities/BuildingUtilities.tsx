import React, { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { getUtilities } from "shared/api/settings";
import { Amenity } from "types/amenities";
import { Utility } from "types/utilities";
import { AsyncSelect } from "widgets/Select";

import { Box, Button, Collapse, Divider, Flex, List, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

import styles from "./BuildingUtilities.module.scss";

interface BuildingUtilitiesProps {
	open: () => void;
}

export const BuildingUtilities: FC<BuildingUtilitiesProps> = ({ open }) => {
	const [openedUtilityBox, { toggle: toggleUtilityBox }] = useDisclosure(true);
	const [defaultValue, setDefaultValue] = useState<Utility[]>([]);
	const {
		setValue,
		formState: { defaultValues }
	} = useFormContext();
	useEffect(() => {
		if (defaultValues?.utilities) {
			setDefaultValue(
				defaultValues?.utilities.map((item: Utility) => ({
					value: item.id,
					label: item.name,
					...item
				}))
			);
		}
	}, [defaultValues?.utilities]);

	const onChange = (values: any) => {
		setDefaultValue(
			values.map((item: Amenity) => ({
				value: item.id,
				label: item.name,
				...item
			}))
		);
		setValue("utilities", values);
	};

	return (
		<Box>
			<Flex justify="space-between">
				<Title className={styles.title} order={5}>
					UTILITIES
				</Title>
				{openedUtilityBox ? (
					<IconArrowUp className={styles.pointer} onClick={toggleUtilityBox} />
				) : (
					<IconArrowDown className={styles.pointer} onClick={toggleUtilityBox} />
				)}
			</Flex>
			<Collapse in={openedUtilityBox} transitionDuration={500} transitionTimingFunction="linear">
				<Flex justify="flex-end">
					<Button classNames={{ root: styles.btn_root }} onClick={open} color="teal">
						CREATE UTILITY
					</Button>
				</Flex>
				<Divider my="sm" />
				<AsyncSelect<Utility>
					entityName="utilities"
					getEntity={getUtilities}
					valueKey="id"
					labelKey={["name"]}
					onChange={onChange}
					defaultValue={defaultValue}
					isMulti={true}
				/>
				{defaultValue.length ? (
					<List>
						{defaultValue.map((item: any, i: number) => (
							<List.Item key={item.id}>
								{i + 1}. {item?.name}
							</List.Item>
						))}
					</List>
				) : (
					<Text>There are no selected utilities yet</Text>
				)}
			</Collapse>
		</Box>
	);
};
