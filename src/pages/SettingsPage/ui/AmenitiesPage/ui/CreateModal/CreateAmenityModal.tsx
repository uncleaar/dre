import React, { FC, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createAmenity } from "shared/api/settings";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { createAmenitySchema } from "shared/validation/createAmenity";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Input, InputWrapper, Select, Text, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { Amenity, AmenityCategories } from "../../../../../../types/amenities";

export interface FormValues {
	category: string;
	name: string;
	notes: string;
	icon: string;
}

interface CreateAmenityModalProps {
	close: () => void;
}

export const CreateAmenityModal: FC<CreateAmenityModalProps> = ({ close }) => {
	const [error, setError] = useState("");
	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm({
		resolver: yupResolver(createAmenitySchema)
	});

	const category = useMemo(() => {
		return Object.values(AmenityCategories);
	}, [AmenityCategories]);

	const { mutate, isLoading } = useMutation({
		mutationKey: ["amenities"],
		mutationFn: async (data: Amenity) => await createAmenity(data),
		onSuccess: async () => {
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.amenity_create });
			close();
		},
		onError: (error: any) => {
			setError(error.response.data.message);
		}
	});
	const onSubmit = (data: Amenity) => {
		mutate(data);
	};

	return (
		<Flex direction="column" gap="md" component="form" onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="category"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<Select
						data={category}
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.category?.message}
					/>
				)}
			/>
			<Controller
				name="name"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<InputWrapper description="Name">
						<Input onChange={onChange} onBlur={onBlur} value={value} error={errors.name?.message} />
					</InputWrapper>
				)}
			/>
			<Controller
				name="icon"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<InputWrapper description="Icon">
						<Input onChange={onChange} onBlur={onBlur} value={value} error={errors.icon?.message} />
					</InputWrapper>
				)}
			/>
			<Controller
				name="notes"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<Textarea
						description="Notes"
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.notes?.message}
					/>
				)}
			/>
			<Text color="red">{error}</Text>
			<Flex justify="space-between">
				<Button color="teal" type="submit" loading={isLoading}>
					Confirm
				</Button>
				<Button color="red" onClick={close}>
					Cancel
				</Button>
			</Flex>
		</Flex>
	);
};
