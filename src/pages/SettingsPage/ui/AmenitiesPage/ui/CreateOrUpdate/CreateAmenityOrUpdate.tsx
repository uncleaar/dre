import React, { FC, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createAmenity, updateAmenity } from "shared/api/settings";
import { AmenityCategories } from "shared/constants/amenity-categories";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { Input } from "shared/ui";
import { createAmenitySchema } from "shared/validation/createAmenity";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, InputWrapper, Select, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Amenity } from "../../../../../../types/amenities";

import styles from "../../../ContactsPage/ui/CreateOrUpdate/CreateOrUpdateContact.module.scss";

interface CreateAmenityProps {
	onClose: () => void;
	edit?: any;
}

type FormValues = {
	id?: string;
	category?: string;
	name?: string;
	notes?: string;
	icon?: string;
};

export const CreateAmenityOrUpdate: FC<CreateAmenityProps> = ({ edit, onClose }) => {
	const queryClient = useQueryClient();

	const [error, setError] = useState();

	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<FormValues>({
		resolver: yupResolver(createAmenitySchema),
		defaultValues: {
			...(edit ? edit : {})
		}
	});

	const category = useMemo(() => {
		return AmenityCategories.map((c) => c.label);
	}, [AmenityCategories]);

	const { mutate: create, isLoading } = useMutation({
		mutationKey: ["amenities"],
		mutationFn: async (data: Amenity) => await createAmenity(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["amenities"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.amenity_create });
			onClose();
		},
		onError: (error: any) => {
			setError(error.response.data.message);
		}
	});

	const { mutate: update, isLoading: updateAmenityIsLoading } = useMutation({
		mutationFn: async (data: Amenity) => await updateAmenity(data, edit.id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["amenities"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.amenity_update });
			onClose();
		}
	});

	const onSubmit = (data: Amenity) => {
		if (data.category) {
			const result = AmenityCategories.find((item) => item.label === data.category);
			data.category = result.value;
		}
		if (!edit) {
			create(data);
		} else {
			update(data);
		}
	};

	return (
		<Flex
			direction="column"
			gap="md"
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			align="center"
		>
			<Controller
				name="category"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<InputWrapper description="Category" classNames={{ description: styles.label }}>
						<Select
							data={category}
							size="lg"
							style={{ width: 300 }}
							radius="md"
							variant="filled"
							placeholder="Select a category"
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.category?.message}
						/>
					</InputWrapper>
				)}
			/>
			<Controller
				name="name"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.name?.message}
						placeholder="Name"
					/>
				)}
			/>
			<Controller
				name="icon"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.icon?.message}
						placeholder="Icon"
					/>
				)}
			/>
			<Controller
				name="notes"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						component="textarea"
						placeholder="Notes"
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.notes?.message}
					/>
				)}
			/>

			<Text color="red">{error}</Text>

			<Flex w={300} justify="space-between">
				<Button color="red" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="default" type="submit" loading={!edit ? isLoading : updateAmenityIsLoading}>
					Confirm
				</Button>
			</Flex>
		</Flex>
	);
};
