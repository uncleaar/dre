import React, { FC, useEffect, useMemo, useState } from "react";
import { createListingPublication } from "shared/api/listing-publications";
import { createListingPublicationBuilding } from "shared/api/listing-publications-buildings";
import { createListingPublicationRoom } from "shared/api/listing-publications-rooms";
import { createListingPublicationUnit } from "shared/api/listing-publications-units";
import { updateListing } from "shared/api/listings";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import useListingStore from "shared/stores/listings/useListingStore.ts";
import { Building } from "types/building";
import { Room } from "types/rooms";
import { Unit } from "types/unit";

import { Box, Button, Flex, Grid, Loader, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconBuilding, IconBuildingCommunity, IconDoor } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TreeComponent } from "./Listing/TreeComponent";
import { AddListingEntities } from "./AddListingEntities";

import styles from "./ListingPage.module.scss";

interface ListingPageProps {
	setDefaultTab: (newTab: string | null) => void;
}

export const ListingPage: FC<ListingPageProps> = ({ setDefaultTab }) => {
	const { listing } = useListingStore();
	const [opened, { open, close }] = useDisclosure(false);
	const queryClient = useQueryClient();
	const [buildings, setBuildings] = useState<Building[]>([]);
	const [units, setUnits] = useState<Unit[]>([]);
	const [rooms, setRooms] = useState<Room[]>([]);

	const { mutate, isLoading: isLoadingCreate } = useMutation({
		mutationKey: ["listings"],
		mutationFn: async (data: { entities: string[] }) =>
			await updateListing(listing?.id as string, data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["listings", listing?.id] });
			close();
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.listing_update });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while updating listing."
			});
		}
	});

	const {
		data: createdPublication,
		mutate: createPublication,
		isLoading: isLoadingCreatePublication
	} = useMutation({
		mutationKey: ["publications"],
		mutationFn: async (listingId: string) => await createListingPublication(listingId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["publications"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.publication_create });
			setDefaultTab("publications");
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while creating the publication."
			});
		}
	});

	const {
		mutate: createBuilding,
		isLoading: isLoadingCreateBuilding,
		isSuccess: isSuccessBuilding
	} = useMutation({
		mutationFn: async (data: { publicationId: string; id: string }) =>
			await createListingPublicationBuilding(data.publicationId, data.id),
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const {
		mutate: createUnits,
		isLoading: isLoadingCreateUnit,
		isSuccess: isSuccessUnit
	} = useMutation({
		mutationFn: async (data: { publicationId: string; unitId: string }) =>
			await createListingPublicationUnit(data.publicationId, data.unitId),
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const {
		mutate: createRoom,
		isLoading: isLoadingCreateRoom,
		isSuccess: isSuccessRoom
	} = useMutation({
		mutationFn: async (data: { publicationId: string; roomId: string }) =>
			await createListingPublicationRoom(data.publicationId, data.roomId),
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const submitPublication = async () => {
		createPublication(listing?.id as string);
	};

	useEffect(() => {
		if (createdPublication?.id && (buildings.length || units.length || rooms.length)) {
			const pId = createdPublication?.id;
			buildings.forEach((b) => createBuilding({ publicationId: pId, id: b?.id }));
			units.forEach((u) => createUnits({ publicationId: pId, unitId: u?.id }));
			rooms.forEach((r) => createRoom({ publicationId: pId, roomId: r?.id }));

			notifications.show({ title: "Success", message: "Publication entities added successfully." });
		}
		setBuildings([]);
		setUnits([]);
		setRooms([]);
	}, [createdPublication]);

	const isListingExists = useMemo(() => {
		return !(listing && !listing?.entities.length);
	}, [listing]);

	return (
		<Grid>
			<Grid.Col span={6}>
				<Box>
					<Button mt={30} mb={50} onClick={open}>
						Add entities
					</Button>
					{!isListingExists && <p>Listing is empty, please add entities.</p>}
					{isLoadingCreateBuilding || isLoadingCreateUnit || isLoadingCreateRoom ? (
						<Box>
							<Loader />
						</Box>
					) : (
						<TreeComponent
							buildings={listing?.buildings}
							units={listing?.units}
							rooms={listing?.rooms}
							selectedBuildings={buildings}
							selectedUnits={units}
							selectedRooms={rooms}
							setSelectedBuildings={setBuildings}
							setSelectedUnits={setUnits}
							setSelectedRooms={setRooms}
						/>
					)}

					<Modal opened={opened} onClose={close} size="35%">
						<AddListingEntities onSubmit={mutate} />
					</Modal>
				</Box>
			</Grid.Col>
			<Grid.Col span={6}>
				{isLoadingCreateBuilding || isLoadingCreateUnit || isLoadingCreateRoom ? (
					<Loader />
				) : (
					<Flex mt={20} ml={20} mih={400} direction="column" justify="space-between">
						{!buildings.length && !units.length && !rooms.length ? (
							<p>To create publication, please select building, unit or room</p>
						) : null}
						<Box>
							{buildings.map((b) => (
								<Flex className={styles.flex} key={b.id}>
									<IconBuilding />
									<p>{b.name}</p>
								</Flex>
							))}
							{units.map((b) => (
								<Flex className={styles.flex} key={b.id}>
									<IconBuildingCommunity />
									<p>{b.unitName}</p>
								</Flex>
							))}
							{rooms.map((b) => (
								<Flex className={styles.flex} key={b.id}>
									<IconDoor />
									<p>{b.roomType}</p>
								</Flex>
							))}
						</Box>
						{buildings.length || units.length || rooms.length ? (
							<Flex justify="flex-end">
								<Button w={200} onClick={submitPublication}>
									Create Publication
								</Button>
							</Flex>
						) : null}
					</Flex>
				)}
			</Grid.Col>
		</Grid>
	);
};
