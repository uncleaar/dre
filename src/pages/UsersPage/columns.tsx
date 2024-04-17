import { Link } from "react-router-dom";
import { User } from "types/user";

import { Box, Button } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<User>();

interface UsersTableColumnsProps {
	handleDelete: (id: string) => void;
	deletingId: string | null;
	handleUpdate: (id: string) => void;
}
export const userTableColumns = (props: UsersTableColumnsProps): ColumnDef<User>[] => [
	{
		header: "Users",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorKey: "firstName",
				header: () => <span>First Name</span>,
				cell: (info) => <Link to={`/users/${info.row.original.id}`}>{info.getValue()}</Link>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "lastName",
				cell: (info) => info.getValue(),
				header: () => <span>Last Name</span>,
				footer: (props) => props.column.id
			},
			{
				accessorFn: (row) => row.role,
				id: "role",
				cell: (info) => info.getValue(),
				header: () => <span>Role</span>,
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
				accessorFn: (row) => row.permissionsSet,
				id: "permissionsSet",
				cell: (info) => info.getValue(),
				header: () => <span>Permission</span>,
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
							// loading={props.deletingId === row.original.id}
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
