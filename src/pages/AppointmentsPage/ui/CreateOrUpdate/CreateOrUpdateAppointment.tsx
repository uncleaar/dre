import dayjs from "dayjs";
import { FC, useCallback, useEffect, useState } from "react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	createAppointment,
	getAppointmentById,
	updateAppointment
} from "shared/api/appointments.ts";
import { getUsers } from "shared/api/users.ts";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages.ts";
import { createAppointmentSchema } from "shared/validation/createAppointment.ts";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Grid, InputWrapper, Textarea, TextInput } from "@mantine/core";
import { ActionIcon, rem } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconClock } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Appointment } from "../../../../types/appointments.ts";
import { AsyncSelect } from "../../../../widgets/Select";

interface CreateOrUpdateAppointmentProps {
	appointmentId?: string;
	onClose: () => void;
}

interface FormValues {
	userId: string;
	reason?: string;
	date: string;
	time: string;
	type?: string;
	meetingPlace: string;
	notes?: string;
}

export const CreateOrUpdateAppointment: FC<CreateOrUpdateAppointmentProps> = ({
	appointmentId,
	onClose
}) => {
	const [user, setUser] = useState<any>(null);
	const formMethods = useForm<FormValues>({
		resolver: yupResolver(createAppointmentSchema)
	});
	const queryClient = useQueryClient();
	const ref = useRef<HTMLInputElement>(null);

	const { data: updateData } = useQuery<Appointment>({
		queryKey: ["appointments", appointmentId],
		queryFn: async () => getAppointmentById(appointmentId as string),
		enabled: !!appointmentId
	});
	useEffect(() => {
		if (updateData) {
			let user: string = "";
			if (updateData?.user?.length) {
				user = `${updateData?.user[0].firstName} ${updateData?.user[0].lastName}`;
			}
			setUser({
				...updateData,
				value: updateData.userId,
				label: user
			});
		}
	}, [updateData]);
	const { mutate: create, isLoading: isCreateLoading } = useMutation({
		mutationKey: ["appointments"],
		mutationFn: async (data: Omit<Appointment, "id">) => await createAppointment(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["appointments"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.appointment_create });
			onClose();
		},
		onError: async () => {
			notifications.show({ title: "Error", message: "An error occurred while creating appointment" });
		}
	});
	const { mutate: update, isLoading: isUpdateLoading } = useMutation({
		mutationKey: ["appointments"],
		mutationFn: async (data: Partial<Appointment>) =>
			await updateAppointment(data, data.id as string),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["appointments"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.appointment_update });
			onClose();
		},
		onError: async () => {
			notifications.show({ title: "Error", message: "An error occurred while updating appointment" });
		}
	});

	const onSubmit = useCallback(
		(data: FormValues) => {
			const { time: _, ...rest } = data;
			const time = data.time.split(":");
			const date = dayjs(data.date)
				.set("hour", Number(time[0]))
				.set("minute", Number(time[1]))
				.format();
			if (appointmentId) {
				update({
					...rest,
					date
				});
			} else {
				create({
					...rest,
					date
				});
			}
		},
		[appointmentId, create, update]
	);

	useEffect(() => {
		if (updateData) {
			formMethods.reset({
				...updateData,
				date: dayjs(updateData.date).format("YYYY-MM-DD"),
				time: dayjs(updateData?.date).format("HH:mm")
			});
		} else {
			formMethods.reset();
		}
	}, [updateData, formMethods, appointmentId]);
	const onChange = (value: any) => {
		setUser(value);
		formMethods.setValue("userId", value.value);
	};
	const pickerControl = (
		<ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
			<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
		</ActionIcon>
	);
	return (
		<Flex
			direction="column"
			gap={16}
			component="form"
			onSubmit={formMethods.handleSubmit(onSubmit as any)}
		>
			<InputWrapper description="Renter Name" error={formMethods.formState.errors.userId?.message}>
				<AsyncSelect
					entityName="users"
					getEntity={getUsers}
					valueKey="id"
					labelKey={["firstName", "lastName"]}
					onChange={onChange}
					defaultValue={user ? [user] : []}
					isMulti={false}
					isError={!!formMethods.formState.errors.userId?.message}
				/>
			</InputWrapper>

			<Controller
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						variant="filled"
						error={formMethods.formState.errors.reason?.message}
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						description="Reason"
					/>
				)}
				name="reason"
				control={formMethods.control}
			/>
			<Grid>
				<Grid.Col span={6}>
					<Controller
						render={({ field: { onChange, onBlur, value } }) => (
							<DateInput
								description="Date"
								minDate={new Date()}
								onChange={onChange}
								onBlur={onBlur}
								value={value ? dayjs(value).toDate() : null}
								variant="filled"
								error={formMethods.formState.errors.date?.message}
							/>
						)}
						name="date"
						control={formMethods.control}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<Controller
						render={({ field: { onChange, value } }) => (
							<TimeInput
								onChange={onChange}
								description="Time"
								variant="filled"
								ref={ref}
								value={value}
								rightSection={pickerControl}
								error={formMethods.formState.errors.time?.message}
							/>
						)}
						name="time"
						control={formMethods.control}
					/>
				</Grid.Col>
			</Grid>
			<Controller
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						variant="filled"
						error={formMethods.formState.errors.type?.message}
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						description="Type"
					/>
				)}
				name="type"
				control={formMethods.control}
			/>
			<Controller
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						variant="filled"
						error={formMethods.formState.errors.meetingPlace?.message}
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						description="Meeting Place"
					/>
				)}
				name="meetingPlace"
				control={formMethods.control}
			/>
			<Controller
				render={({ field: { onChange, onBlur, value } }) => (
					<Textarea
						variant="filled"
						error={formMethods.formState.errors.notes?.message}
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						description="Notes"
					/>
				)}
				name="notes"
				control={formMethods.control}
			/>
			<Flex justify="center">
				<Button
					type="submit"
					variant="outline"
					color="green"
					loading={isCreateLoading || isUpdateLoading}
				>
					SUBMIT
				</Button>
			</Flex>
		</Flex>
	);
};
