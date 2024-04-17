import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { convertBuildingAddress } from "shared/lib/convertBuildingAddress.ts";

import { Box, Button } from "@mantine/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { Listing } from "../../types/listings.ts";

const columnHelper = createColumnHelper<Listing>();

interface ListingTableColumnsProps {
	handleDelete: (id: string) => void;
	deletingId: string | null;
	// handleUpdate: (id: string) => void;
	handleView: (id: string) => void;
}
export const listingTableColumns = (props: ListingTableColumnsProps): ColumnDef<Listing>[] => [
	{
		header: "Listing",
		footer: (props) => props.column.id,
		columns: [
			{
				accessorKey: "humanReadableId",
				header: () => <span>Id</span>,
				cell: (info) => <Link to={`/listings/${info.row.original.id}`}>{info.getValue()}</Link>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "buildings",
				header: () => <span>Building Address</span>,
				cell: (info) => {
					const address = convertBuildingAddress({ buildings: info.getValue() });
					return <span>{address}</span>;
				},
				footer: (props) => props.column.id
			},
			{
				accessorKey: "units",
				header: () => <span>Units#</span>,
				cell: (info) => <span>{info.getValue().length}</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "rooms",
				header: () => <span>Rooms#</span>,
				cell: (info) => <span>{info.getValue().length}</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "status",
				header: () => <span>Status</span>,
				cell: (info) => <span>{info.getValue()}</span>,
				footer: (props) => props.column.id
			},
			{
				accessorKey: "notes",
				header: () => <span>Notes</span>,
				cell: (info) => (
					<div>
						{info.getValue().map((a: string, i: number) => (
							<p key={i}>{a}</p>
						))}
					</div>
				),
				footer: (props) => props.column.id
			},
			{
				accessorKey: "createdBy",
				header: () => <span>Created By</span>,
				cell: (info) => (
					<span>
						{info.getValue()[0].firstName} {info.getValue()[0].lastName}
					</span>
				),
				footer: (props) => props.column.id
			},
			{
				accessorKey: "createdAt",
				header: () => <span>Created At</span>,
				cell: (info) => {
					let date = info.getValue();
					date = dayjs(date).format("YYYY-MM-DD");
					return <span>{date}</span>;
				},
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

						{/*<Button color="green" onClick={() => row.original.id && props.handleUpdate(row.original.id)}>*/}
						{/*    Update*/}
						{/*</Button>*/}
					</Box>
				)
			})
		]
	}
];
