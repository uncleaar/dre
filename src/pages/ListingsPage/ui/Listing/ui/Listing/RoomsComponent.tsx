import { FC } from "react";
import { Room } from "types/rooms";

import { ActionIcon, Box, Checkbox, Flex } from "@mantine/core";
import { IconSquareArrowRightFilled } from "@tabler/icons-react";

interface RoomsComponentProps {
	room: Room;
	onSelectRoom: (value: Room, checked: boolean) => void;
}

export const RoomsComponent: FC<RoomsComponentProps> = ({ room, onSelectRoom }) => {
	return (
		<Box ml={30}>
			<Flex justify="space-between">
				<Flex mb={20} gap={30} style={{ borderBottom: "1px #F1F3F5 solid" }}>
					<ActionIcon variant="transparent" aria-label="arrow-right">
						<IconSquareArrowRightFilled style={{ color: "#099268", cursor: "pointer" }} />
					</ActionIcon>
					<p>{room.roomType}</p>
					<p>{room.status}</p>
				</Flex>
				<Checkbox onChange={(e) => onSelectRoom(room, e.target.checked)} />
			</Flex>
		</Box>
	);
};
