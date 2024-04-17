import dayjs from "dayjs";

import { Box, Button, Flex } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { Prospect } from "../../../../types/prospects.ts";

const columnHelper = createColumnHelper<Prospect>();

interface ProspectTableColumnsProps {
	handleUpdate: (id: string) => void;
	handleDelete: (id: string) => void;
	handleView: (id: string) => void;
}
export const prospectsTableColumns = ({
	handleUpdate,
	handleDelete,
	handleView
}: ProspectTableColumnsProps): ColumnDef<Prospect>[] => [
	{
		header: "Prospect",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorKey: "id",
				header: () => <span>Prospect ID</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "contact",
				header: () => <span>Contact</span>,
				cell: (props) => {
					const contact = props.getValue();
					return (
						<Flex gap={10}>
							<span>{contact[0].firstName}</span>
							<span>{contact[0].lastName},</span>
							<span>{contact[0].phoneNumber}</span>
						</Flex>
					);
				},
				footer: (props) => props.column.id
			},
			{
				accessorKey: "leaseEndDate",
				header: () => <span>LeaseEndDate</span>,
				cell: (props) => <span>{dayjs(props.getValue()).format("YYYY-MM-DD")}</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "availability",
				header: () => <span>Availability</span>,
				cell: (props) => {
					const availability = props.getValue();
					return (
						<span>
							{availability[0]?.startTime ? dayjs(availability[0]?.startTime).format("YYYY-MM-DD") : "-"}
						</span>
					);
				},
				footer: (props) => props.column.id
			},
			columnHelper.display({
				id: "actions",
				header: () => <span>Actions</span>,
				cell: (props) => (
					<Box display="flex" style={{ gap: 20 }}>
						<Button size="xs" variant="outline" onClick={() => handleView(props.row.original.id)}>
							View
						</Button>
						<Button
							color="red"
							size="xs"
							variant="outline"
							onClick={() => handleDelete(props.row.original.id)}
						>
							Delete
						</Button>
						<Button
							color="green"
							size="xs"
							variant="outline"
							onClick={() => handleUpdate(props.row.original.id)}
						>
							Update
						</Button>
					</Box>
				)
			})
		]
	}
];
