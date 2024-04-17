import { FC, useState } from "react";
import { getUnits } from "shared/api/units";

import { ActionIcon, Box, Checkbox, Flex } from "@mantine/core";
import { IconSquareArrowDownFilled, IconSquareArrowRightFilled } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { Building } from "../../../../../../types/building";
import { Room } from "../../../../../../types/rooms";
import { Unit, Units } from "../../../../../../types/unit";

import { UnitsComponent } from "./UnitsComponent";

interface BuildingsComponentProps {
	building: Building | any;
	onSelectBuilding: (value: Building, checked: boolean) => void;
	onSelectUnit: (value: Unit, checked: boolean) => void;
	onSelectRoom: (value: Room, checked: boolean) => void;
}

export const BuildingsComponent: FC<BuildingsComponentProps> = ({
	building,
	onSelectBuilding,
	onSelectUnit,
	onSelectRoom
}) => {
	const [open, setOpen] = useState(false);
	const { data, isLoading } = useQuery<Units>({
		queryKey: ["units", building.id],
		queryFn: () => getUnits({ buildingId: [building.id] }),
		keepPreviousData: true,
		enabled: !!building?.id
	});

	return (
		<Box>
			<Flex justify="space-between">
				<Flex mb={16} gap={30} style={{ borderBottom: "1px #F1F3F5 solid" }}>
					{open ? (
						<ActionIcon variant="filled" aria-label="arrow-down" onClick={() => setOpen((p) => !p)}>
							<IconSquareArrowDownFilled style={{ color: "#F03E3E", cursor: "pointer" }} />
						</ActionIcon>
					) : (
						<ActionIcon variant="transparent" aria-label="arrow-right" onClick={() => setOpen((p) => !p)}>
							<IconSquareArrowRightFilled style={{ color: "#FF6B6B", cursor: "pointer" }} />
						</ActionIcon>
					)}
					<p>{building?.name}</p>
					<p>{building?.buildingType}</p>
				</Flex>
				<Checkbox onChange={(e) => onSelectBuilding(building, e.target.checked)} />
			</Flex>
			<Box>
				{open &&
					data?.list &&
					data?.list.map((unit) => (
						<UnitsComponent
							onSelectUnit={onSelectUnit}
							onSelectRoom={onSelectRoom}
							key={unit?.id}
							unit={unit}
						/>
					))}
			</Box>
		</Box>
	);
};
