import React, { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import {
	createListingPublicationRoom,
	getListingPublicationsRooms
} from "shared/api/listing-publications-rooms";
import { getListingById } from "shared/api/listings";

import { Box, Button, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Listing } from "../../../../../../types/listings";

interface ListingPublicationRoomCreateProps {
	id: string;
	close: () => void;
}

export const ListingPublicationRoomCreate: FC<ListingPublicationRoomCreateProps> = ({
	id,
	close
}) => {
	const { id: listing_id } = useParams();
	const [room, setRoom] = useState<any>({});
	const queryClient = useQueryClient();

	const { data: listing } = useQuery<Listing>({
		queryKey: ["listings", listing_id],
		queryFn: () => getListingById(listing_id as string),
		enabled: !!listing_id
	});

	const { data: publicationRooms } = useQuery({
		queryKey: ["listing-publication-rooms", id],
		queryFn: () => getListingPublicationsRooms({ listingPublicationId: id }),
		enabled: !!id
	});

	const { mutate: createRoom, isLoading: isLoadingCreateRoom } = useMutation({
		mutationKey: ["listing-publication-rooms"],
		mutationFn: async (roomId: string) => await createListingPublicationRoom(id, roomId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["listing-publication-rooms"] });
			close();
			notifications.show({
				title: "Success",
				message: "Listing publication room created successfully"
			});
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const roomsData = useMemo(() => {
		if (listing && publicationRooms?.list) {
			const idSet = new Set(publicationRooms?.list.map((obj) => obj.id));
			return listing?.rooms.filter((obj) => !idSet.has(obj.id));
		}
		return [];
	}, [publicationRooms, listing]);

	const options = useMemo(() => {
		return roomsData.map((b) => ({
			value: b.id,
			label: b.roomType,
			...b
		}));
	}, [roomsData]);

	const onSubmit = async () => {
		try {
			if (room?.id) {
				createRoom(room.id);
			}
		} catch (error: any) {
			notifications.show({ title: "Error", message: error.message });
		}
	};

	return (
		<Flex style={{ minHeight: 400 }} direction="column" justify="space-between">
			<Box>
				<Select options={options} onChange={(value) => setRoom(value)} />
			</Box>
			<Button onClick={onSubmit} loading={isLoadingCreateRoom} w={200} disabled={!room?.id}>
				Submit
			</Button>
		</Flex>
	);
};
