import { Room } from "types/rooms";

import { Box, Button } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Room>();

interface RoomsTableColumnsProps {
	handleDelete: (id: string) => void;
	handleUpdate: (id: string) => void;
	handleView: (id: string) => void;
}

export const roomsTableColumns = (props: RoomsTableColumnsProps): ColumnDef<Room>[] => [
	{
		header: "Rooms",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorKey: "roomType",
				header: () => <span>Room Type</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "availability",
				header: () => <span>Availability</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "unitRent",
				header: () => <span>Unit Rent</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "feePercent",
				header: () => <span>Fee Percent</span>,
				footer: (props) => props.column.id
			},
			columnHelper.display({
				id: "actions",
				header: () => <span>Actions</span>,
				cell: ({ row }) => (
					<Box display="flex" style={{ gap: 20 }}>
						<Button size="xs" onClick={() => props.handleView(row.original.id)}>
							View
						</Button>

						<Button
							size="xs"
							color="red"
							onClick={() => row.original.id && props.handleDelete(row.original.id)}
						>
							Delete
						</Button>

						<Button
							size="xs"
							color="green"
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
