import { Box, Button } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { Appointment } from "../../../types/appointments.ts";

const columnHelper = createColumnHelper<Appointment>();

interface AppointmentsTableColumnsProps {
	handleDelete: (id: string) => void;
	handleUpdate: (id: string) => void;
	handleView: (id: string) => void;
	deletingId: string | null;
}

export const appointmentsTableColumns = (
	props: AppointmentsTableColumnsProps
): ColumnDef<Appointment>[] => [
	{
		header: "Appointments",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorFn: (row) => row?.user,
				id: "userId",
				cell: (info) => (
					<span>
						{info.getValue()[0].firstName} {info.getValue()[0].lastName}
					</span>
				),
				header: () => <span>Rental Name</span>,
				footer: (props) => props.column.id
			},
			{
				accessorFn: (row) => row.type,
				id: "type",
				cell: (info) => info.getValue(),
				header: () => <span>Type</span>,
				enableSorting: false,
				footer: (props) => props.column.id
			},
			{
				accessorFn: (row) => row.date,
				id: "date",
				cell: (info) => info.getValue(),
				header: () => <span>Date</span>,
				enableSorting: false,
				footer: (props) => props.column.id
			},
			{
				accessorFn: (row) => row.meetingPlace,
				id: "meetingPlace",
				cell: (info) => info.getValue(),
				header: () => <span>Meeting Place</span>,
				enableSorting: false,
				footer: (props) => props.column.id
			},
			columnHelper.display({
				id: "actions",
				header: () => <span>Actions</span>,
				cell: ({ row }) => (
					<Box display="flex" style={{ gap: 20 }}>
						<Button size="xs" onClick={() => row.original.id && props.handleView(row.original.id)}>
							View
						</Button>
						<Button
							color="red"
							size="xs"
							onClick={() => row.original.id && props.handleDelete(row.original.id)}
						>
							Delete
						</Button>

						<Button
							color="green"
							size="xs"
							onClick={() => row.original.id && props.handleUpdate(row.original.id)}
						>
							Update
						</Button>
					</Box>
				)
			})
		]
	}
];
