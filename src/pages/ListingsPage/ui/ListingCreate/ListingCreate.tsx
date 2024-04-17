import React, { FC, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { AsyncPaginate } from "react-select-async-paginate";
import { getBuildings } from "shared/api/buildings";
import { createListing } from "shared/api/listings";
import { getRooms } from "shared/api/rooms";
import { getUnits } from "shared/api/units";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { AsyncSelectPaginate } from "widgets/AsyncSelectPaginate/AsyncSelectPaginate";

import { Box, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Building } from "../../../../types/building";

import styles from "./ListingCreate.module.scss";

interface ListingCreateProps {}

export const ListingCreate: FC<ListingCreateProps> = () => {
	const queryClient = useQueryClient();
	const pageSize = 10;

	const {
		handleSubmit,
		control,
		formState: { errors, defaultValues }
	} = useForm();

	const loadOptionsUnits = useCallback(
		async (searchQuery: any, loadedOptions: any, { page }: any) => {
			const response = await getUnits({
				page,
				perPage: pageSize,
				search: searchQuery,
				buildingId: []
			});

			const options = response.list.map((unit) => ({
				value: unit.id,
				label: unit.unitName
			}));

			return {
				options,
				hasMore: response.meta.page * response.meta.perPage < response.meta.total,
				additional: {
					page: page + 1
				}
			};
		},
		[pageSize]
	);

	const loadOptionsRooms = useCallback(
		async (searchQuery: any, loadedOptions: any, { page }: any) => {
			const response = await getRooms({
				page,
				perPage: pageSize,
				search: searchQuery
			});

			const options = response.list.map((unit) => ({
				value: unit.id,
				label: unit.roomNumber
			}));

			return {
				options,
				hasMore: response.meta.page * response.meta.perPage < response.meta.total,
				additional: {
					page: page + 1
				}
			};
		},
		[pageSize]
	);

	const { mutate: create, isLoading } = useMutation({
		mutationKey: ["listings"],
		mutationFn: async (data: string[]) => await createListing(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["listings"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.listing_create });
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const onSubmit = async (data: any) => {
		const entities = [];

		if (data.buildings && data.buildings.value) {
			entities.push(data.buildings.value);
		}
		if (data.units && data.units.value) {
			entities.push(data.units.value);
		}
		if (data.rooms && data.rooms.value) {
			entities.push(data.rooms.value);
		}

		create(entities);
	};

	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit as any)} className={styles.box}>
			<Controller
				name="buildings"
				control={control}
				rules={{ required: "This field is required" }}
				render={({ field }) => (
					<AsyncSelectPaginate
						{...field}
						loadOptions={getBuildings}
						onChange={(value) => field.onChange(value)}
						onBlur={() => field.onBlur()}
						pageSize={10}
						getOptionLabel={(building: Building) => building.name}
						getOptionValue={(building: Building) => building.id}
					/>
				)}
			/>

			<Controller
				name="units"
				control={control}
				rules={{ required: "This field is required" }}
				render={({ field }) => (
					<AsyncPaginate
						{...field}
						placeholder="Search units"
						loadOptions={loadOptionsUnits}
						additional={{
							page: 1
						}}
						value={field.value}
						onChange={(value) => field.onChange(value)}
						onBlur={() => field.onBlur()}
					/>
				)}
			/>

			<Controller
				name="rooms"
				control={control}
				rules={{ required: "This field is required" }}
				render={({ field }) => (
					<AsyncPaginate
						{...field}
						loadOptions={loadOptionsRooms}
						placeholder="Search rooms"
						additional={{
							page: 1
						}}
						value={field.value}
						onChange={(value) => field.onChange(value)}
						onBlur={() => field.onBlur()}
					/>
				)}
			/>

			<Button type="submit" w="150" mx="auto">
				Create
			</Button>
		</Box>
	);
};
