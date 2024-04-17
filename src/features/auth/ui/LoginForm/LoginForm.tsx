import { useStateContext } from "app/providers/StateProvider/state";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getMeFn, loginUser } from "shared/api/auth";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN, ROUTES } from "shared/constants";
import { Input } from "shared/ui";
import { loginSchema } from "shared/validation/loginSchema";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAt, IconPassword } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import styles from "./LoginForm.module.scss";

export interface FormValues {
	email: string;
	password: string;
}

export const LoginForm = () => {
	const navigate = useNavigate();

	const { dispatch, state } = useStateContext();

	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<FormValues>({ resolver: yupResolver(loginSchema) });

	const query = useQuery(["authUser"], getMeFn, {
		enabled: false,
		select: (data) => data,
		onSuccess: (data) => {
			dispatch({ type: "SET_USER", payload: data });
		}
	});

	const { mutate, isLoading } = useMutation(
		(data: { email: string; password: string }) => loginUser(data),
		{
			onSuccess: (data) => {
				query.refetch();
				localStorage.setItem(COOKIE_ACCESS_TOKEN, data?.accessToken);
				localStorage.setItem(COOKIE_REFRESH_TOKEN, data?.refreshToken);
				dispatch({ type: "SET_TOKEN", payload: data });
				navigate(ROUTES.HOME);
			},
			onError: (error: any) => {
				notifications.show({ title: "Error", message: error.message });
			}
		}
	);

	const onSubmit = (data: { email: string; password: string }) => {
		mutate(data);
	};

	return (
		<Box
			onSubmit={handleSubmit(onSubmit)}
			component="form"
			display="flex"
			className={styles.box}
			data-testid="login"
		>
			<Controller
				control={control}
				name="email"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						data-testid="email"
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.email?.message}
						placeholder="Email"
						icon={<IconAt />}
						autoComplete="current-password"
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
						data-testid="password"
						error={errors.password?.message}
						value={value}
						type="password"
						placeholder="Password"
						icon={<IconPassword />}
						autoComplete="current-password"
					/>
				)}
			/>

			<Group display="flex">
				<Button type="submit" loading={isLoading}>
					Sign in
				</Button>

				<Button to={ROUTES.REGISTER} component={Link} variant="default">
					Sign up
				</Button>
			</Group>
		</Box>
	);
};
