import React, { FC, useCallback, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { deleteVideo } from "shared/api/videos.ts";
import useBuildingStore from "shared/stores/buildings/useBuildingStore.ts";
import useRoomStore from "shared/stores/rooms/useRoomStore.ts";
import useUnitStore from "shared/stores/units/useUnitStore.ts";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal.tsx";

import { Button, Flex, Pagination, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Video } from "../../types/videos.ts";

import styles from "./Videos.module.scss";

interface VideosProps {
	entityId: string;
	entity: "building" | "unit" | "room";
}
export const Videos: FC<VideosProps> = ({ entity, entityId }) => {
	const queryClient = useQueryClient();
	const [deleteId, setDeleteId] = useState("");
	const [openedDelete, { open, close }] = useDisclosure(false);

	const { videos: buildingVideos, setBuildingVideosData } = useBuildingStore();
	const { videos: unitVideos, setUnitVideosData } = useUnitStore();
	const { videos: roomVideos, setRoomVideosData } = useRoomStore();

	const { mutate, isLoading } = useMutation({
		mutationKey: ["videos"],
		mutationFn: async (id: string) => deleteVideo(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["videos", entityId] });
		}
	});
	const onOpen = useCallback(
		(id: string) => {
			setDeleteId(id);
			open();
		},
		[open]
	);
	const onDelete = () => {
		if (deleteId) {
			mutate(deleteId);
		}
		close();
	};
	const videos = useMemo(() => {
		if (entity === "building") {
			return buildingVideos;
		}
		if (entity === "unit") {
			return unitVideos;
		}
		if (entity === "room") {
			return roomVideos;
		}
	}, [buildingVideos, entity, unitVideos, roomVideos]);

	const onChangePage = useCallback(
		(value: number) => {
			if (entity === "building") {
				setBuildingVideosData({ page: value });
			}
			if (entity === "unit") {
				setUnitVideosData({ page: value });
			}
			if (entity === "room") {
				setRoomVideosData({ page: value });
			}
		},
		[entity, setBuildingVideosData, setUnitVideosData, setRoomVideosData]
	);

	if (!videos?.data.length)
		return (
			<Flex justify="center">
				<Text my={16}>There is no video added yet. </Text>
			</Flex>
		);
	return (
		<Flex direction="column" align="center">
			<Flex wrap="wrap" gap={16}>
				<DeleteModal opened={openedDelete} loading={isLoading} onClose={close} onDelete={onDelete} />
				{videos.data.map((video) => (
					<div key={video.publicUrl}>
						<ReactPlayer
							className={styles.react_player_cst}
							controls={true}
							height={300}
							width="auto"
							url={video.publicUrl}
						/>
						<Flex justify="center">
							<Button
								color="red"
								size="xs"
								mt={8}
								loading={isLoading}
								variant="outline"
								onClick={() => onOpen(video.id)}
							>
								<IconTrash style={{ height: "70%" }} />
							</Button>
						</Flex>
					</div>
				))}
			</Flex>
			<Pagination
				total={Math.ceil(videos.total / videos.perPage)}
				value={videos.page}
				siblings={1}
				onChange={(value) => onChangePage(value)}
			/>
		</Flex>
	);
};
