import React, { FC, useCallback, useMemo, useState } from "react";
import useBuildingStore from "shared/stores/buildings/useBuildingStore.ts";
import useRoomStore from "shared/stores/rooms/useRoomStore.ts";
import useUnitStore from "shared/stores/units/useUnitStore.ts";
import { Image } from "shared/ui/Image/Image";

import { Flex, Image as MTImage, Modal, Pagination, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface ImagesProps {
	entityId: string;
	entity: "building" | "unit" | "room";
}

export const Images: FC<ImagesProps> = ({ entityId, entity }) => {
	const [opened, { open, close }] = useDisclosure(false);
	const [currentImg, setCurrentImg] = useState("");
	const { photos: buildingPhotos, setBuildingPhotosData } = useBuildingStore();
	const { photos: unitPhotos, setUnitPhotosData } = useUnitStore();
	const { photos: roomPhotos, setRoomPhotosData } = useRoomStore();
	const onClick = (url: string) => {
		setCurrentImg(url);
		open();
	};
	const photos = useMemo(() => {
		if (entity === "building") {
			return buildingPhotos;
		}
		if (entity === "unit") {
			return unitPhotos;
		}
		if (entity === "room") {
			return roomPhotos;
		}
	}, [buildingPhotos, entity, roomPhotos, unitPhotos]);

	const onChangePage = useCallback(
		(value: number) => {
			if (entity === "building") {
				setBuildingPhotosData({ page: value });
			}
			if (entity === "unit") {
				setUnitPhotosData({ page: value });
			}
			if (entity === "room") {
				setRoomPhotosData({ page: value });
			}
		},
		[entity, setBuildingPhotosData, setRoomPhotosData, setUnitPhotosData]
	);

	if (!photos?.data.length)
		return (
			<Flex justify="center">
				<Text my={16}>There is no photo added yet. </Text>
			</Flex>
		);
	return (
		<>
			<Flex direction="column" align="center">
				<Flex wrap="wrap" gap={16} mb={16}>
					{photos.data.map((img) => (
						<Image key={img.publicUrl} img={img} onClick={onClick} entityId={entityId} />
					))}
				</Flex>
				<Pagination
					total={Math.ceil(photos.total / photos.perPage)}
					value={photos.page}
					siblings={1}
					onChange={(value) => onChangePage(value)}
				/>
			</Flex>
			<Modal opened={opened} onClose={close} size="auto">
				<MTImage h={700} w="auto" src={currentImg} />
			</Modal>
		</>
	);
};
