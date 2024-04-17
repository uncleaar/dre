import { Box, Button } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { Amenity } from "../../../../types/amenities";

const columnHelper = createColumnHelper<Amenity>();

interface ContactsTableColumnsProps {
	handleDelete: (id: string) => void;
	handleUpdate: (id: string) => void;
	deletingId: string | null;
}

export const amenitiesTableColumns = (props: ContactsTableColumnsProps): ColumnDef<Amenity>[] => [
	{
		header: "Amenities",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorFn: (row) => row.name,
				id: "name",
				cell: (info) => info.getValue(),
				header: () => <span>Name</span>,
				footer: (props) => props.column.id
			},
			{
				accessorFn: (row) => row.category,
				id: "category",
				cell: (info) => info.getValue(),
				header: () => <span>Category</span>,
				enableSorting: false,
				footer: (props) => props.column.id
			},
			{
				accessorFn: (row) => row.notes,
				id: "notes",
				cell: (info) => info.getValue(),
				header: () => <span>Notes</span>,
				enableSorting: false,
				footer: (props) => props.column.id
			},
			columnHelper.display({
				id: "actions",
				header: () => <span>Actions</span>,
				cell: ({ row }) => (
					<Box display="flex" style={{ gap: 20 }}>
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
