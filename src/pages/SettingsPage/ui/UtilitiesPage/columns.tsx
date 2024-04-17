import { Box, Button } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { Utility } from "../../../../types/utilities";

const columnHelper = createColumnHelper<Utility>();

interface ContactsTableColumnsProps {
	handleDelete: (id: string) => void;
	handleUpdate: (id: string) => void;
	deletingId: string | null;
}

export const contactsTableColumns = (props: ContactsTableColumnsProps): ColumnDef<Utility>[] => [
	{
		header: "Utilities",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorKey: "name",
				header: () => <span>Name</span>,
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
