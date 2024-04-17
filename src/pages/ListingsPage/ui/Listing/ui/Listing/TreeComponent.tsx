import React, { FC, useMemo, useState } from "react";

import { Box, Divider } from "@mantine/core";

import { Building } from "../../../../../../types/building";
import { Room } from "../../../../../../types/rooms";
import { Unit } from "../../../../../../types/unit";

import { BuildingsComponent } from "./BuildingsComponent";
import { RoomsComponent } from "./RoomsComponent";
import { UnitsComponent } from "./UnitsComponent";

interface TreeComponentProps {
	buildings?: Building[];
	units?: Unit[];
	rooms?: Room[];
	selectedBuildings: Building[];
	selectedUnits: Unit[];
	selectedRooms: Room[];
	setSelectedBuildings: (value: Building[]) => void;
	setSelectedUnits: (value: Unit[]) => void;
	setSelectedRooms: (value: Room[]) => void;
}

export const TreeComponent: FC<TreeComponentProps> = ({
	buildings,
	rooms,
	units,
	setSelectedRooms,
	selectedBuildings,
	selectedRooms,
	selectedUnits,
	setSelectedUnits,
	setSelectedBuildings
}) => {
	const onSelectBuilding = (value: Building, checked: boolean) => {
		const newBuildings = checked
			? [...selectedBuildings, value]
			: (selectedBuildings || []).filter((b) => b.id !== value.id);
		setSelectedBuildings(newBuildings);
	};

	const onSelectUnit = (value: Unit, checked: boolean) => {
		const newUnits = checked
			? [...selectedUnits, value]
			: (selectedUnits || []).filter((u) => u.id !== value.id);
		setSelectedUnits(newUnits);
	};

	const onSelectRoom = (value: Room, checked: boolean) => {
		const newRooms = checked
			? [...selectedRooms, value]
			: (selectedRooms || []).filter((r) => r.id !== value.id);
		setSelectedRooms(newRooms);
	};

	const unitsWithoutParent = useMemo(() => {
		if (units) {
			return units.filter((item) => buildings?.some((b: any) => b.id !== item.buildingId));
		}
	}, [units, buildings]);

	const roomsWithoutParent = useMemo(() => {
		if (rooms) {
			return rooms.filter((item) => units?.some((b) => b.id !== item.unitId));
		}
	}, [rooms, units]);
	return (
		<Box>
			<Box>
				{buildings && buildings.length > 0
					? buildings.map((building) => (
							<BuildingsComponent
								onSelectBuilding={onSelectBuilding}
								onSelectUnit={onSelectUnit}
								onSelectRoom={onSelectRoom}
								key={building?.id}
								building={building}
							/>
						))
					: units && units.length > 0
						? units.map((unit) => (
								<UnitsComponent
									onSelectUnit={onSelectUnit}
									onSelectRoom={onSelectRoom}
									key={unit?.id}
									unit={unit}
								/>
							))
						: (rooms || []).map((room) => (
								<RoomsComponent onSelectRoom={onSelectRoom} key={room?.id} room={room} />
							))}
				{!!unitsWithoutParent?.length && <Divider mb={20} mt={20} />}
				{unitsWithoutParent &&
					unitsWithoutParent.map((unit) => (
						<UnitsComponent
							onSelectUnit={onSelectUnit}
							onSelectRoom={onSelectRoom}
							key={unit?.id}
							unit={unit}
						/>
					))}
				{!!roomsWithoutParent?.length && <Divider mb={20} mt={20} />}
				{roomsWithoutParent &&
					roomsWithoutParent.map((room) => (
						<RoomsComponent onSelectRoom={onSelectRoom} key={room?.id} room={room} />
					))}
			</Box>
		</Box>
	);
};
