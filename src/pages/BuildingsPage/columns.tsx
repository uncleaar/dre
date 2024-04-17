import { Box, Button } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { Building } from "../../types/building";

const columnHelper = createColumnHelper<Building>();

interface BuildingTableColumnsProps {
	handleUpdate: (id: string) => void;
	handleDelete: (id: string) => void;
	handleView: (id: string) => void;
}

export const buildingsTableColumns = ({
	handleUpdate,
	handleDelete,
	handleView
}: BuildingTableColumnsProps): ColumnDef<Building>[] => [
	{
		header: "Building",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorKey: "name",
				header: () => <span>Name</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "slug",
				header: () => <span>Slug</span>,
				footer: (props) => props.column.id
			},
			columnHelper.display({
				id: "actions",
				header: () => <span>Actions</span>,
				cell: (props) => (
					<Box display="flex" style={{ gap: 20 }}>
						<Button size="xs" onClick={() => handleView(props.row.original.id)}>
							View
						</Button>
						<Button color="red" size="xs" onClick={() => handleDelete(props.row.original.id)}>
							Delete
						</Button>
						<Button color="green" size="xs" onClick={() => handleUpdate(props.row.original.id)}>
							Update
						</Button>
					</Box>
				)
			})
		]
	}
];
