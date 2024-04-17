import { FC, useState } from "react";
import { getRooms } from "shared/api/rooms";
import { Room, Rooms } from "types/rooms";
import { Unit } from "types/unit";

import { ActionIcon, Box, Checkbox, Flex } from "@mantine/core";
import { IconSquareArrowDownFilled, IconSquareArrowRightFilled } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { RoomsComponent } from "./RoomsComponent";

interface UnitsComponentProps {
	unit: Unit;
	onSelectUnit: (value: Unit, checked: boolean) => void;
	onSelectRoom: (value: Room, checked: boolean) => void;
}

export const UnitsComponent: FC<UnitsComponentProps> = ({ unit, onSelectUnit, onSelectRoom }) => {
	const [open, setOpen] = useState(false);
	const { data, isLoading } = useQuery<Rooms>({
		queryKey: ["rooms", unit.id],
		queryFn: () => getRooms({ unitId: [unit.id] }),
		keepPreviousData: true,
		enabled: !!unit?.id
	});

	return (
		<Box ml={30}>
			<Flex justify="space-between">
				<Flex mb={20} gap={30} style={{ borderBottom: "1px #F1F3F5 solid" }}>
					{open ? (
						<ActionIcon variant="filled" aria-label="arrow-down" onClick={() => setOpen((p) => !p)}>
							<IconSquareArrowDownFilled style={{ color: "#033ec0", cursor: "pointer" }} />
						</ActionIcon>
					) : (
						<ActionIcon variant="transparent" aria-label="arrow-right" onClick={() => setOpen((p) => !p)}>
							<IconSquareArrowRightFilled style={{ color: "rgba(3,62,192,0.56)", cursor: "pointer" }} />
						</ActionIcon>
					)}
					<p>{unit?.unitName}</p>
					<p>{unit?.unitType}</p>
				</Flex>
				<Checkbox onChange={(e) => onSelectUnit(unit, e.target.checked)} />
			</Flex>
			<Box>
				{open &&
					data?.list &&
					data?.list.map((room) => (
						<RoomsComponent onSelectRoom={onSelectRoom} key={room?.id} room={room} />
					))}
			</Box>
		</Box>
	);
};
