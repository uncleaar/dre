import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getPermissions } from "shared/api/permissions";
import { createUser, updateUser } from "shared/api/users";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { Input, SelectInput } from "shared/ui";
import { createUserSchema } from "shared/validation";
import { updateUserSchema } from "shared/validation";
import { User } from "types/user";
import { Maybe } from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, InputWrapper, PasswordInput, rem, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAt } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Permission } from "../../../../types/permission";

import styles from "./CreateOrUpdateUser.module.scss";

export interface FormValues {
	email: string;
	password: Maybe<string | undefined>;
	firstName: string;
	lastName: string;
	role: string;
	permissionsSet: Maybe<string | undefined>;
}

interface CreateUserProps {
	onClose: () => void;
	edit?: any;
}

export const CreateOrUpdateUser: FC<CreateUserProps> = ({ onClose, edit }) => {
	const queryClient = useQueryClient();
	const [error, setError] = useState();
	const schema = edit ? updateUserSchema : createUserSchema;

	const { data: permissionsSets, isLoading: isPermissionsLoading } = useQuery<Permission[]>({
		queryKey: ["permissions"],
		queryFn: getPermissions
	});

	const [permissionsSetsOptions, serPermissionsSetsOptions] = useState<any>([]);

	useEffect(() => {
		if (!permissionsSets) {
			return;
		}

		const newPermissionsSetsOptions = permissionsSets.map((permissionsSet) => ({
			label: permissionsSet.name,
			value: permissionsSet.name
		}));

		serPermissionsSetsOptions(newPermissionsSetsOptions);
	}, [permissionsSets]);

	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<FormValues>({
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		resolver: yupResolver(schema),
		defaultValues: {
			...(edit ? edit : {})
		}
	});

	const { mutate: create, isLoading } = useMutation({
		mutationKey: ["users"],
		mutationFn: async (data: User) => await createUser(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["users"] });
			onClose();
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.user_create });
		},
		onError: (error: any) => {
			setError(error.response.data.message);
		}
	});

	const { mutate: update, isLoading: isLoadingUserUpdate } = useMutation({
		mutationFn: async (data: User) => updateUser(data, edit.id),
		onSuccess: async () => {
			await queryClient.invalidateQueries(["users"]);
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.user_update });
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const onSubmit = (data: User) => {
		if (!edit) {
			create(data);
		} else {
			update(data);
		}
	};

	return (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		<Box onSubmit={handleSubmit(onSubmit)} component="form" display="flex" className={styles.box}>
			<Controller
				control={control}
				name="email"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.email?.message}
						placeholder="Email"
						icon={<IconAt />}
					/>
				)}
			/>

			<Controller
				control={control}
				name="firstName"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.firstName?.message}
						placeholder="First name"
					/>
				)}
			/>

			<Controller
				control={control}
				name="lastName"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.lastName?.message}
						placeholder="Last name"
					/>
				)}
			/>

			<Controller
				control={control}
				name="role"
				render={({ field: { onChange, onBlur, value } }) => (
					<SelectInput
						value={value}
						onChange={onChange}
						placeholder="Role"
						onBlur={onBlur}
						error={errors?.role?.message}
						data={[
							{
								label: "Support staff",
								value: "supportStaff"
							},
							{
								label: "User",
								value: "user"
							}
						]}
					/>
				)}
			/>

			<Controller
				control={control}
				name="permissionsSet"
				render={({ field: { onChange, onBlur, value } }) => (
					<SelectInput
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						value={value}
						onChange={onChange}
						placeholder="Permissions Set"
						onBlur={onBlur}
						error={errors?.role?.message}
						data={[
							{
								label: "Support staff",
								value: "supportStaff"
							},
							...permissionsSetsOptions
						]}
					/>
				)}
			/>

			<Controller
				control={control}
				name="password"
				render={({ field: { onChange, onBlur, value } }) => (
					<InputWrapper description="Password" classNames={{ description: styles.label }}>
						<PasswordInput
							onChange={onChange}
							onBlur={onBlur}
							style={{ width: rem(300) }}
							size="lg"
							radius="md"
							variant="filled"
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							value={value}
							error={errors.password?.message}
							placeholder="password"
						/>
					</InputWrapper>
				)}
			/>

			<Text color="red">{error}</Text>

			<Button variant="default" type="submit" loading={isLoading}>
				{!edit ? "Create" : "Update"}
			</Button>
		</Box>
	);
};
