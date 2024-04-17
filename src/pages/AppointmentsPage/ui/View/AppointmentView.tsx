import dayjs from "dayjs";
import { FC } from "react";
import { getAppointmentById } from "shared/api/appointments.ts";

import { Flex, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { Appointment } from "../../../../types/appointments.ts";

interface AppointmentViewProps {
	appointmentId: string;
}
export const AppointmentView: FC<AppointmentViewProps> = ({ appointmentId }) => {
	const { data } = useQuery<Appointment>({
		queryKey: ["appointments", appointmentId],
		queryFn: async () => getAppointmentById(appointmentId)
	});
	return (
		<Flex
			direction="column"
			gap={16}
			style={{
				border: "1px #E9ECEF solid",
				padding: "0.8rem",
				borderRadius: 8
			}}
		>
			<Flex justify="space-between">
				<Title order={5}>Rental Name</Title>
				<Text>{data?.user ? `${data.user[0].firstName} ${data.user[0].lastName}` : "-"}</Text>
			</Flex>
			<Flex justify="space-between">
				<Title order={5}>Type</Title>
				<Text>{data?.type || "-"}</Text>
			</Flex>
			<Flex justify="space-between">
				<Title order={5}>Date</Title>
				<Text>{dayjs(data?.date).format("YYYY MMMM DD, hh:mm A") || "-"}</Text>
			</Flex>
			<Flex justify="space-between">
				<Title order={5}>Meeting Place</Title>
				<Text>{data?.meetingPlace || "-"}</Text>
			</Flex>
			<Flex justify="space-between">
				<Title order={5}>Reason</Title>
				<Text>{data?.reason || "-"}</Text>
			</Flex>
		</Flex>
	);
};
