import React, { FC } from "react";
import { deletePhoto } from "shared/api/photos";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";

import { Box, Button, Flex, Image as MTImage } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Photo } from "../../../types/photos";

interface ImageProps {
	img: Photo;
	onClick: (id: string) => void;
	entityId: string;
}

export const Image: FC<ImageProps> = ({ img, onClick, entityId }) => {
	const queryClient = useQueryClient();
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
	const { mutate, isLoading } = useMutation({
		mutationKey: ["photos"],
		mutationFn: async (id: string) => deletePhoto(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["photos", entityId] });
		}
	});

	return (
		<Box>
			<DeleteModal
				opened={openedDelete}
				loading={isLoading}
				onClose={closeDeleteModal}
				onDelete={() => mutate(img.id)}
			/>
			<MTImage
				onClick={() => onClick(img.publicUrl)}
				key={img.publicUrl}
				radius={10}
				h={150}
				w="auto"
				mb={8}
				src={img.publicUrl}
				style={{ cursor: "pointer" }}
			/>
			<Flex justify="center">
				<Button color="red" size="xs" loading={isLoading} variant="outline" onClick={openDeleteModal}>
					<IconTrash style={{ height: "70%" }} />
				</Button>
			</Flex>
		</Box>
	);
};
