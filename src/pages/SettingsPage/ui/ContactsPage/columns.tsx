import { Contact } from "types/contacts";

import { Box, Button } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Contact>();

interface ContactsTableColumnsProps {
	handleDelete: (id: string) => void;
	handleUpdate: (id: string) => void;
	deletingId: string | null;
}

export const contactsTableColumns = (props: ContactsTableColumnsProps): ColumnDef<Contact>[] => [
	{
		header: "Contacts",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorKey: "firstName",
				header: () => <span>First Name</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "lastName",
				cell: (info) => info.getValue(),
				header: () => <span>Last Name</span>,
				footer: (props) => props.column.id
			},
			{
				accessorFn: (row) => row.phoneNumber,
				id: "phoneNumber",
				cell: (info) => info.getValue(),
				header: () => <span>Phone number</span>,
				footer: (props) => props.column.id
			},
			{
				accessorFn: (row) => row.email,
				id: "email",
				cell: (info) => info.getValue(),
				header: () => <span>Email</span>,
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
