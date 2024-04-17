import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	deleteListingPublicationBuilding,
	getListingPublicationsBuildings
} from "shared/api/listing-publications-buildings";
import {
	deleteListingPublicationRoom,
	getListingPublicationsRooms
} from "shared/api/listing-publications-rooms";
import {
	deleteListingPublicationUnit,
	getListingPublicationsUnits
} from "shared/api/listing-publications-units";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import usePublicationStore from "shared/stores/publications/usePublicationStore";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";

import { Box, Button, Modal, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NotificationData, notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CreateOrUpdateRoom } from "../../../../../UnitsPage/ui/Rooms/ui/CreateOrUpdate/CreateOrUpdateRoom";
import { RoomView } from "../../../../../UnitsPage/ui/Rooms/ui/View/RoomView";
import { ListingPublicationBuildingCreate } from "../ListingPublicationBuildingCreate/ListingPublicationBuildingCreate";
import { ListingPublicationRoomCreate } from "../ListingPublicationRoomCreate/ListingPublicationRoomCreate";
import { ListingPublicationUnitCreate } from "../ListingPublicationUnitCreate/ListingPublicationUnitCreate";

interface ListingPropertiesProps {
	listingId: string;
}

export const ListingProperties: FC<ListingPropertiesProps> = ({ listingId }) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setPublicationStoreData } = usePublicationStore();
	const [opened, { open, close }] = useDisclosure(false);
	const [openedCreateOrUpdate, { open: openCreateOrUpdate, close: closeCreateOrUpdate }] =
		useDisclosure(false);
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
	const [openedAddBuilding, { open: openAddBuilding, close: closeAddBuilding }] =
		useDisclosure(false);
	const [openedAddUnit, { open: openAddUnit, close: closeAddUnit }] = useDisclosure(false);
	const [openedAddRoom, { open: openAddRoom, close: closeAddRoom }] = useDisclosure(false);
	const [deleteId, setDeleteId] = useState("");
	const [entity, setEntity] = useState("");

	const [roomId, setRoomId] = useState("");
	const [unitId, setUnitId] = useState("");

	const { data: buildingsData } = useQuery({
		queryKey: ["listing-publication-buildings", listingId],
		queryFn: () =>
			getListingPublicationsBuildings({
				listingPublicationId: listingId as string
			})
	});

	const { data: unitsData } = useQuery({
		queryKey: ["listing-publication-units", listingId],
		queryFn: () =>
			getListingPublicationsUnits({
				listingPublicationId: listingId as string
			})
	});

	const { data: roomsData } = useQuery({
		queryKey: ["listing-publication-rooms", listingId],
		queryFn: () =>
			getListingPublicationsRooms({
				listingPublicationId: listingId as string
			})
	});

	const { mutate: mutateDeleteUnitPublication, isLoading: isLoadingDeleteUnitPublication } =
		useMutation({
			mutationKey: ["listing-publication-units"],
			mutationFn: async (id: string) => await deleteListingPublicationUnit(listingId as string, id),
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: ["listing-publication-units"] });
				closeDeleteModal();
				notifications.show({ title: "Success", message: SUCCESS_MESSAGES.unit_delete });
			}
		});

	const { mutate: mutateDeleteRoomPublication, isLoading: isLoadingDeleteRoomPublication } =
		useMutation({
			mutationKey: ["listing-publication-rooms"],
			mutationFn: async (id: string) => await deleteListingPublicationRoom(listingId as string, id),
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: ["listing-publication-rooms"] });
				closeDeleteModal();
				notifications.show({ title: "Success", message: SUCCESS_MESSAGES.room_delete });
			}
		});

	const { mutate: mutateDeleteListingBuilding, isLoading: isLoadingDeleteBuildingPublication } =
		useMutation({
			mutationKey: ["listing-publication-buildings"],
			mutationFn: async (buildingId: string) =>
				await deleteListingPublicationBuilding(listingId, buildingId),
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: ["listing-publication-buildings"] });
				closeDeleteModal();
				notifications.show({ title: "Success", message: SUCCESS_MESSAGES.building_delete });
			},
			onError: () => {
				notifications.show({
					title: "Error",
					message: "An error occurred while deleting building",
					color: "red"
				} as NotificationData);
			}
		});

	useEffect(() => {
		if (buildingsData) {
			setPublicationStoreData({ buildings: buildingsData.list });
		}
		if (unitsData) {
			setPublicationStoreData({ units: unitsData.list });
		}
		if (roomsData) {
			setPublicationStoreData({ rooms: roomsData.list });
		}
	}, [buildingsData, unitsData, roomsData]);

	const handleViewRoom = (id: string) => {
		setRoomId(id);
		open();
	};

	const handleUpdateRoom = (id: string, unit: string) => {
		setRoomId(id);
		setUnitId(unit);
		openCreateOrUpdate();
	};

	const onDeleteBuilding = (id: string) => {
		setDeleteId(id);
		setEntity("building");
		openDeleteModal();
	};

	const onDeleteUnit = (id: string) => {
		setDeleteId(id);
		setEntity("unit");
		openDeleteModal();
	};

	const onDeleteRoom = (id: string) => {
		setDeleteId(id);
		setEntity("room");
		openDeleteModal();
	};

	const onDelete = () => {
		if (entity === "building") {
			mutateDeleteListingBuilding(deleteId);
		}
		if (entity === "unit") {
			mutateDeleteUnitPublication(deleteId);
		}
		if (entity === "room") {
			mutateDeleteRoomPublication(deleteId);
		}
	};
	return (
		<Box>
			<Title order={5} mb={8}>
				Properties
			</Title>
			<Table withColumnBorders withTableBorder withRowBorders>
				<Table.Tbody>
					<Table.Tr>
						<Table.Td></Table.Td>
						<Table.Td>
							<Button size="xs" variant="outline" onClick={() => openAddBuilding()}>
								Add building
							</Button>
						</Table.Td>
						<Table.Td>
							<Button size="xs" variant="outline" onClick={() => openAddUnit()}>
								Add unit
							</Button>
						</Table.Td>
						<Table.Td>
							<Button size="xs" variant="outline" onClick={() => openAddRoom()}>
								Add room
							</Button>
						</Table.Td>
					</Table.Tr>
					{buildingsData?.list.length
						? buildingsData.list.map((building) => (
								<Table.Tr key={building.id}>
									<Table.Td w="60%">{building.name}</Table.Td>
									<Table.Td>
										<Button
											size="xs"
											variant="outline"
											onClick={() => navigate(`/listing-publications/${listingId}/buildings/${building.id}`)}
										>
											View
										</Button>
									</Table.Td>
									<Table.Td>
										<Button
											size="xs"
											variant="outline"
											color="red"
											onClick={() => onDeleteBuilding(building.id)}
										>
											Delete
										</Button>
									</Table.Td>
									<Table.Td>
										<Button
											size="xs"
											variant="outline"
											color="green"
											onClick={() =>
												navigate(`/listing-publications/${listingId}/update-building/${building.id}`)
											}
										>
											Update
										</Button>
									</Table.Td>
								</Table.Tr>
							))
						: null}
					{unitsData?.list.length
						? unitsData.list.map((unit) => (
								<Table.Tr key={unit.id}>
									<Table.Td w="60%">{unit.unitName}</Table.Td>
									<Table.Td>
										<Button
											size="xs"
											variant="outline"
											onClick={() => navigate(`/listing-publications/${listingId}/units/${unit.id}`)}
										>
											View
										</Button>
									</Table.Td>
									<Table.Td>
										<Button size="xs" variant="outline" color="red" onClick={() => onDeleteUnit(unit.id)}>
											Delete
										</Button>
									</Table.Td>
									<Table.Td>
										<Button
											size="xs"
											variant="outline"
											color="green"
											onClick={() => navigate(`/listing-publications/${listingId}/update-unit/${unit.id}`)}
										>
											Update
										</Button>
									</Table.Td>
								</Table.Tr>
							))
						: null}
					{roomsData?.list.length
						? roomsData.list.map((room) => (
								<Table.Tr key={room.id}>
									<Table.Td w="60%">{room.roomType}</Table.Td>
									<Table.Td>
										<Button size="xs" variant="outline" onClick={() => handleViewRoom(room.id)}>
											View
										</Button>
									</Table.Td>
									<Table.Td>
										<Button size="xs" variant="outline" color="red" onClick={() => onDeleteRoom(room.id)}>
											Delete
										</Button>
									</Table.Td>
									<Table.Td>
										<Button
											size="xs"
											variant="outline"
											color="green"
											onClick={() => handleUpdateRoom(room.id, room.unitId)}
										>
											Update
										</Button>
									</Table.Td>
								</Table.Tr>
							))
						: null}
				</Table.Tbody>
			</Table>
			<Modal opened={opened} onClose={close} centered size="50%">
				<RoomView roomId={roomId} onClose={close} listingId={listingId} />
			</Modal>
			<Modal opened={openedCreateOrUpdate} onClose={closeCreateOrUpdate} centered size="50%">
				<CreateOrUpdateRoom
					isEdit={true}
					roomId={roomId}
					unitId={unitId}
					onClose={closeCreateOrUpdate}
					listingId={listingId}
				/>
			</Modal>
			<DeleteModal
				opened={openedDelete}
				loading={
					isLoadingDeleteBuildingPublication ||
					isLoadingDeleteRoomPublication ||
					isLoadingDeleteUnitPublication
				}
				onClose={closeDeleteModal}
				onDelete={onDelete}
			/>
			<Modal
				opened={openedAddBuilding}
				onClose={closeAddBuilding}
				title="Add building listing"
				centered
			>
				<ListingPublicationBuildingCreate id={listingId} close={closeAddBuilding} />
			</Modal>
			<Modal
				className="modal"
				opened={openedAddUnit}
				onClose={closeAddUnit}
				title="Add unit listing"
				centered
			>
				<ListingPublicationUnitCreate id={listingId} close={closeAddUnit} />
			</Modal>
			<Modal
				className="modal"
				opened={openedAddRoom}
				onClose={closeAddRoom}
				title="Add room listing"
				centered
			>
				<ListingPublicationRoomCreate id={listingId} close={closeAddRoom} />
			</Modal>
		</Box>
	);
};
