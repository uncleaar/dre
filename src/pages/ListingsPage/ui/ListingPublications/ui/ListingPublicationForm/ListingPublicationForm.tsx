// import React, { FC } from "react";
// import { useForm } from "react-hook-form";
// import { createListingPublicationBuilding } from "shared/api/listing-publications-buildings";
// import { createListingPublicationRoom } from "shared/api/listing-publications-rooms";
// import { createListingPublicationUnit } from "shared/api/listing-publications-units";
// import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
//
// import { Box, Button } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
//
// import { ListingPublicationBuildingCreate } from "../ListingPublicationBuildingCreate/ListingPublicationBuildingCreate";
// import { ListingPublicationRoomCreate } from "../ListingPublicationRoomCreate/ListingPublicationRoomCreate";
// import { ListingPublicationUnitCreate } from "../ListingPublicationUnitCreate/ListingPublicationUnitCreate";
//
// import styles from "../../ListingPublications.module.scss";
//
// interface ListingPublicationFormProps {
// 	id: string;
// }
//
// export const ListingPublicationForm: FC<ListingPublicationFormProps> = ({ id }) => {
// 	const queryClient = useQueryClient();
//
// 	const {
// 		handleSubmit,
// 		control,
// 		reset,
// 		formState: { errors, defaultValues }
// 	} = useForm();
//
// 	const { mutate: createBuildings, isLoading } = useMutation({
// 		mutationKey: ["listing-publication-buildings"],
// 		mutationFn: async (buildingId: string) => await createListingPublicationBuilding(id, buildingId),
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["listings"] });
// 			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.listing_create_building });
// 		},
// 		onError: (error: any) => {
// 			notifications.show({ title: "Error", message: error.message });
// 		}
// 	});
//
// 	const { mutate: createUnits, isLoading: isLoadingCreateUnits } = useMutation({
// 		mutationKey: ["listing-publication-units"],
// 		mutationFn: async (unitId: string) => await createListingPublicationUnit(id, unitId),
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["listings"] });
// 			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.listing_create_unit });
// 		},
// 		onError: (error: any) => {
// 			notifications.show({ title: "Error", message: error.message });
// 		}
// 	});
//
// 	const { mutate: createRooms, isLoading: isLoadingCreateRooms } = useMutation({
// 		mutationKey: ["listing-publication-rooms"],
// 		mutationFn: async (roomId: string) => await createListingPublicationRoom(id, roomId),
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["listings"] });
// 			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.listing_create_room });
// 		},
// 		onError: (error: any) => {
// 			notifications.show({ title: "Error", message: error.message });
// 		}
// 	});
//
// 	const onSubmit = async (data: any) => {
// 		try {
// 			createBuildings(data.buildings.value);
// 			createUnits(data.units.value);
// 			createRooms(data.rooms.value);
// 		} catch (error: any) {
// 			notifications.show({ title: "Error", message: error.message });
// 		}
// 	};
//
// 	return (
// 		<Box className={styles.create} component="form" onSubmit={handleSubmit(onSubmit)}>
// 			<ListingPublicationBuildingCreate id={id} control={control} />
// 			<ListingPublicationUnitCreate id={id} control={control} />
// 			<ListingPublicationRoomCreate id={id} control={control} />
// 			<Button type="submit">Create</Button>
// 		</Box>
// 	);
// };
