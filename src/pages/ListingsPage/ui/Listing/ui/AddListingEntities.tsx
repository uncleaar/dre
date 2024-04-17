import React, { FC, useState } from "react";
import { getBuildings } from "shared/api/buildings";
import { getRooms } from "shared/api/rooms";
import { getUnits } from "shared/api/units";
import { Building } from "types/building";
import { Room } from "types/rooms";
import { Unit } from "types/unit";

import { Box, Button, Divider, InputWrapper } from "@mantine/core";

import { AsyncSelect } from "../../../../../widgets/Select";

import styles from "./ListingPage.module.scss";

interface AddListingEntitiesProps {
	onSubmit: (data: { entities: string[] }) => void;
}

export const AddListingEntities: FC<AddListingEntitiesProps> = ({ onSubmit }) => {
	const [buildings, setBuildings] = useState<any>([]);
	const [units, setUnits] = useState<any>([]);
	const [rooms, setRooms] = useState<any>([]);

	const onBuildingChange = (values: any) => {
		setBuildings(
			values.map((item: Building) => ({
				value: item.id,
				label: item.name,
				...item
			}))
		);
	};
	const onUnitChange = (values: any) => {
		setUnits(
			values.map((item: Unit) => ({
				value: item.id,
				label: item.unitName,
				...item
			}))
		);
	};
	const onRoomChange = (values: any) => {
		setRooms(
			values.map((item: Room) => ({
				value: item.id,
				label: item.roomType,
				...item
			}))
		);
	};
	const onClick = () => {
		const entities = buildings.concat(units, rooms).map((item: any) => item.id);
		onSubmit({ entities });
	};
	return (
		<Box className={styles.modal_content}>
			<InputWrapper label="Select Buildings">
				<AsyncSelect
					entityName="buildings"
					getEntity={getBuildings}
					valueKey="id"
					labelKey={["name"]}
					onChange={onBuildingChange}
					defaultValue={buildings}
					isMulti={true}
				/>
			</InputWrapper>
			<Divider mb={25} mt={25} />
			<InputWrapper label="Select Units">
				<AsyncSelect
					entityName="units"
					getEntity={getUnits}
					valueKey="id"
					labelKey={["unitName"]}
					onChange={onUnitChange}
					defaultValue={units}
					isMulti={true}
				/>
			</InputWrapper>
			<Divider mb={25} mt={25} />
			<InputWrapper label="Select Rooms">
				<AsyncSelect
					entityName="rooms"
					getEntity={getRooms}
					valueKey="id"
					labelKey={["roomType"]}
					onChange={onRoomChange}
					defaultValue={rooms}
					isMulti={true}
				/>
			</InputWrapper>
			<Button mt={50} color="green" onClick={onClick}>
				Confirm
			</Button>
		</Box>
	);
};
