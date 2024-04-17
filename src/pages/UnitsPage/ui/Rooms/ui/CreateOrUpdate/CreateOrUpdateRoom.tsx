import React, { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
	getListingPublicationsRoom,
	updateListingPublicationRoom
} from "shared/api/listing-publications-rooms";
import { createRoom, getRoom, updateRoom } from "shared/api/rooms";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { transformFormValuesToRoom } from "shared/lib/transformFormValuesToRoom";
import { transformRoomToFormValues } from "shared/lib/transformRoomToFormValues";
import { createRoomSchema } from "shared/validation/createRoom";
import { FormValues, Room } from "types/rooms";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Container, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CreateOrUpdateRoomForm } from "../Form/CreateOrUpdateRoomForm";

interface CreateOrUpdateRoomProps {
	isEdit: boolean;
	roomId?: string;
	unitId?: string;
	onClose: () => void;
	listingId?: string;
}
export const CreateOrUpdateRoom: FC<CreateOrUpdateRoomProps> = ({
	isEdit,
	roomId,
	unitId,
	onClose,
	listingId
}: CreateOrUpdateRoomProps) => {
	const queryClient = useQueryClient();
	const formMethods = useForm<FormValues>({ resolver: yupResolver(createRoomSchema) });
	const { data } = useQuery({
		queryKey: [!listingId ? "rooms" : "listing-publication-rooms", roomId],
		queryFn: !listingId
			? async () => getRoom(roomId as string, { contacts: true, amenities: true })
			: async () => getListingPublicationsRoom(listingId as string, roomId as string),
		keepPreviousData: true,
		enabled: !!roomId
	});
	useEffect(() => {
		if (isEdit && data) {
			const init = transformRoomToFormValues(data);
			formMethods.reset(init as any);
		}
	}, [isEdit, data, formMethods]);

	const { mutate: update, isLoading } = useMutation({
		mutationFn: !listingId
			? async (data: Room) => updateRoom(data, roomId as string)
			: async (data: Room) =>
					updateListingPublicationRoom(listingId as string, roomId as string, data),
		onSuccess: async () => {
			await queryClient.invalidateQueries([!listingId ? "rooms" : "listing-publication-rooms"]);
			onClose();
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.room_update });
		},
		onError: (error: any) => {
			notifications.show({
				title: "Error",
				message: "An error occurred while updating the room."
			});
		}
	});

	const { mutate: create } = useMutation({
		mutationKey: ["rooms"],
		mutationFn: async (data: Room) => await createRoom(unitId as string, data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["rooms"] });
			onClose();
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.room_create });
		},
		onError: (error: any) => {
			notifications.show({
				title: "Error",
				message: "An error occurred while creating the room."
			});
		}
	});

	const onSubmit = (data: any) => {
		const transformed = transformFormValuesToRoom(data as any);
		if (!isEdit) {
			create(transformed as any);
		} else {
			update(transformed as any);
		}
	};

	return (
		<Container>
			<FormProvider {...formMethods}>
				<Flex
					onSubmit={formMethods.handleSubmit(onSubmit)}
					component="form"
					gap={20}
					direction="column"
				>
					<Box>
						<CreateOrUpdateRoomForm />
					</Box>
					<Flex justify="space-between">
						<Button variant="default" onClick={onClose}>
							Cancel
						</Button>
						<Button color="teal" type="submit" loading={isLoading} w={100}>
							Save
						</Button>
					</Flex>
				</Flex>
			</FormProvider>
		</Container>
	);
};
