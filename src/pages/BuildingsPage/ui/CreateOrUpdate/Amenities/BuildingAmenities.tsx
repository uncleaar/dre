import React, { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { getAmenities } from "shared/api/settings";
import { Amenity } from "types/amenities";
import { AsyncSelect } from "widgets/Select";

import { Box, Button, Collapse, Divider, Flex, List, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

import styles from "./BuildingAmenities.module.scss";

interface BuildAmenitiesProps {
	open: () => void;
}

export const BuildingAmenities: FC<BuildAmenitiesProps> = ({ open }) => {
	const [openedAmenitiesBox, { toggle: toggleAmenitiesBox }] = useDisclosure(true);
	const [defaultValue, setDefaultValue] = useState<any>([]);
	const {
		setValue,
		formState: { defaultValues }
	} = useFormContext();
	useEffect(() => {
		if (defaultValues?.amenities) {
			setDefaultValue(
				defaultValues?.amenities.map((item: Amenity) => ({
					value: item.id,
					label: item.name,
					...item
				}))
			);
		}
	}, [defaultValues?.amenities]);

	const onChange = (values: any) => {
		setDefaultValue(
			values.map((item: Amenity) => ({
				value: item.id,
				label: item.name,
				...item
			}))
		);
		setValue("amenities", values);
	};
	return (
		<Box>
			<Flex justify="space-between">
				<Title className={styles.title} order={5}>
					AMENITIES
				</Title>
				{openedAmenitiesBox ? (
					<IconArrowUp className={styles.pointer} onClick={toggleAmenitiesBox} />
				) : (
					<IconArrowDown className={styles.pointer} onClick={toggleAmenitiesBox} />
				)}
			</Flex>
			<Collapse in={openedAmenitiesBox} transitionDuration={500} transitionTimingFunction="linear">
				<Flex justify="flex-end">
					<Button classNames={{ root: styles.btn_root }} onClick={open} color="teal">
						CREATE AMENITY
					</Button>
				</Flex>
				<Divider my="sm" />
				<AsyncSelect
					entityName="amenities"
					getEntity={getAmenities}
					valueKey="id"
					labelKey={["name"]}
					onChange={onChange}
					defaultValue={defaultValue}
					isMulti={true}
				/>
				{defaultValue?.length ? (
					<List>
						{defaultValue.map((item: Amenity, i: number) => (
							<List.Item key={item.id}>
								{i + 1}. {item?.name} {item?.category}
							</List.Item>
						))}
					</List>
				) : (
					<p>There are no selected amenities yet</p>
				)}
			</Collapse>
		</Box>
	);
};
