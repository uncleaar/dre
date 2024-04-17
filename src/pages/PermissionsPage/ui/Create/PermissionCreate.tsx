import { Controller, useForm } from "react-hook-form";
import { createPermission } from "shared/api/permissions";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { Input } from "shared/ui";
import { createPermissionSchema } from "shared/validation";
import { Permission } from "types/permission";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import styles from "./PermissionCreate.module.scss";

type FormValues = {
	name: string;
	description: string;
};
export const PermissionCreate = () => {
	const queryClient = useQueryClient();

	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<FormValues>({ resolver: yupResolver(createPermissionSchema) });

	const { mutate, isLoading } = useMutation({
		mutationKey: ["permissions"],
		mutationFn: async (data: Permission) => await createPermission(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["permissions"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.permission_create });
		},
		onError: async (error: any) => {
			notifications.show({
				color: "red",
				title: "Error",
				message: error.response?.data?.message?.forEach((msg: string) => msg)
			});
		}
	});

	const onSubmit = (data: Permission) => {
		mutate(data);
	};

	return (
		<Box onSubmit={handleSubmit(onSubmit)} component="form" display="flex" className={styles.box}>
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
				name="description"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.description?.message}
						placeholder="Description"
					/>
				)}
			/>

			<Button variant="default" type="submit" loading={isLoading}>
				Create
			</Button>
		</Box>
	);
};
