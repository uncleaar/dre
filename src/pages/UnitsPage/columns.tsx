import { Box, Button } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { Unit } from "../../types/unit";

const columnHelper = createColumnHelper<Unit>();

interface UnitsTableColumnsProps {
	handleDelete: (id: string) => void;
	deletingId: string | null;
	handleUpdate: (id: string) => void;
	handleView: (id: string) => void;
}

export const unitsTableColumns = (props: UnitsTableColumnsProps): ColumnDef<Unit>[] => [
	{
		header: "Units",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorKey: "unitName",
				header: () => <span>Unit Name</span>,

				footer: (props) => props.column.id
			},
			{
				accessorKey: "status",
				header: () => <span>Status</span>,
				footer: (props) => props.column.id
			},
			/*{
				accessorKey: "SqrFt",
				header: () => <span>SqrFt</span>,
				footer: (props) => props.column.id,
			},*/
			{
				accessorKey: "unitNumber",
				header: () => <span>Unit number</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "unitRent",
				header: () => <span>Unit rent</span>,
				footer: (props) => props.column.id
			},
			/*{
				accessorKey: "unitType",
				header: () => <span>Unit type</span>,
				footer: (props) => props.column.id,
			},*/
			/*{
				accessorKey: "notes",
				header: () => <span>Notes</span>,
				footer: (props) => props.column.id,
			},
			{
				accessorKey: "numberOfFloors",
				header: () => <span>Number of floors</span>,
				footer: (props) => props.column.id,
			},*/
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
