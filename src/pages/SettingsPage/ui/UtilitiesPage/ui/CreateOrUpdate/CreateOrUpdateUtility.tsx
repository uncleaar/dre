import React, { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createUtility, updateUtility } from "shared/api/settings";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { Input } from "shared/ui";
import { createUtilitySchema } from "shared/validation/createUtility";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAt } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Utility } from "../../../../../../types/utilities";

interface CreateUtilityProps {
	onClose: () => void;
	edit?: any;
}

type FormValues = {
	name: string;
	notes: string;
	icon: string;
};

export const CreateUtilityOrUpdate: FC<CreateUtilityProps> = ({ edit, onClose }) => {
	const queryClient = useQueryClient();

	const [error, setError] = useState();

	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<FormValues>({
		resolver: yupResolver(createUtilitySchema),
		defaultValues: {
			...(edit ? edit : {})
		}
	});

	const { mutate: create, isLoading } = useMutation({
		mutationKey: ["utilities"],
		mutationFn: async (data: Utility) => await createUtility(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["utilities"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.utility_create });
			onClose();
		},
		onError: (error: any) => {
			setError(error.response.data.message);
		}
	});

	const { mutate: update, isLoading: updateUtilityIsLoading } = useMutation({
		mutationFn: async (data: Utility) => await updateUtility(data, edit.id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["utilities"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.contact_update });
			onClose();
		}
	});

	const onSubmit = (data: Utility) => {
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
				control={control}
				name="name"
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
				control={control}
				name="icon"
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
				control={control}
				name="notes"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						rows={3}
						component="textarea"
						value={value}
						error={errors.notes?.message}
						placeholder="Notes"
					/>
				)}
			/>

			<Text color="red">{error}</Text>

			<Flex justify="space-between" w={300}>
				<Button color="red" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="default" type="submit" loading={!edit ? isLoading : updateUtilityIsLoading}>
					Confirm
				</Button>
			</Flex>
		</Flex>
	);
};
