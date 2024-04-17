import React, { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createContact, updateContact } from "shared/api/settings";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { transformPhoneNumber } from "shared/lib/transformPhoneNumber/tranformPhoneNumber.ts";
import { Input } from "shared/ui";
import { PhoneInput } from "shared/ui/PhoneInput/PhoneInput";
import { createContactSchema } from "shared/validation/createContact";
import { Contact } from "types/contact";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, InputWrapper, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAt } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import styles from "./CreateOrUpdateContact.module.scss";

interface CreateContactProps {
	onClose: () => void;
	edit?: any;
}

type FormValues = {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	addressForNotices: string;
	notes: string;
};

export const CreateContactOrUpdate: FC<CreateContactProps> = ({ edit, onClose }) => {
	const queryClient = useQueryClient();

	const [error, setError] = useState();

	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<FormValues>({
		resolver: yupResolver(createContactSchema),
		defaultValues: {
			...(edit ? edit : {})
		}
	});

	const { mutate: create, isLoading } = useMutation({
		mutationKey: ["contacts"],
		mutationFn: async (data: Contact) => await createContact(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["contacts"] });
			onClose();
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.contact_create });
		},
		onError: (error: any) => {
			setError(error.response.data.message);
		}
	});

	const { mutate: update, isLoading: updateContactIsLoading } = useMutation({
		mutationFn: async (data: Contact) => await updateContact(data, edit.id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["contacts"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.contact_update });
			onClose();
		}
	});

	const onSubmit = (data: Contact) => {
		data.phoneNumber = transformPhoneNumber(data.phoneNumber);
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
				name="phoneNumber"
				render={({ field: { onChange, onBlur, value } }) => (
					<InputWrapper description="Phone number" classNames={{ description: styles.label }}>
						<PhoneInput
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.phoneNumber?.message}
							placeholder="Phone number"
						/>
					</InputWrapper>
				)}
			/>

			<Controller
				control={control}
				name="addressForNotices"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.addressForNotices?.message}
						placeholder="Address"
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
						value={value}
						component="textarea"
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

				<Button variant="default" type="submit" loading={!edit ? isLoading : updateContactIsLoading}>
					Confirm
				</Button>
			</Flex>
		</Flex>
	);
};
