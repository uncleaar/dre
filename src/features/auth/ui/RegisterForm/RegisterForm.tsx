import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "shared/api/auth";
import { ROUTES } from "shared/constants";
import { Input } from "shared/ui";
import { registerSchema } from "shared/validation";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAt, IconPassword } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

import styles from "./RegisterForm.module.scss";

export interface FormValues {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

export const RegisterForm = () => {
	// const [registerUser, { isLoading: isLoadingRegister, isError: isErrorRegister }] =
	// 	useRegisterMutation();
	const navigate = useNavigate();

	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<FormValues>({ resolver: yupResolver(registerSchema) });

	// const register = async (data: {
	// 	email: string;
	// 	password: string;
	// 	firstName: string;
	// 	lastName: string;
	// }) => {
	// 	try {
	// 		await registerUser(data).unwrap();

	// 		navigate(ROUTES.LOGIN);
	// 	} catch (err) {
	// 		notifications.show({
	// 			message: "Something went wrong",
	// 			color: "red"
	// 		});
	// 	}
	// };

	const { mutate } = useMutation({
		mutationFn: (data: { email: string; password: string; firstName: string; lastName: string }) =>
			registerUser(data),
		onSuccess: () => {
			navigate(ROUTES.LOGIN);
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const onSubmit = async (data: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
	}) => {
		await mutate(data);
	};

	return (
		<Box className={styles.box} onSubmit={handleSubmit(onSubmit)} component="form" display="flex">
			<Controller
				control={control}
				name="email"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						placeholder="Email"
						error={errors.email?.message}
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
						placeholder="First name"
						error={errors.firstName?.message}
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
						placeholder="Last name"
						error={errors.lastName?.message}
					/>
				)}
			/>

			<Controller
				control={control}
				name="password"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						type="password"
						error={errors.password?.message}
						placeholder="Password"
						icon={<IconPassword />}
					/>
				)}
			/>
			<Group display="flex">
				<Button type="submit">Sign up</Button>

				<Button to={ROUTES.LOGIN} component={Link} variant="default">
					Sign in
				</Button>
			</Group>
		</Box>
	);
};
