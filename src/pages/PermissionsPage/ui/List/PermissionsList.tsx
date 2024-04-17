import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { deletePermission, getPermissions } from "shared/api/permissions";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { useTableState } from "shared/hooks/useTableState";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";
import { Permission } from "types/permission";

import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { PermissionCreate } from "../Create/PermissionCreate";

const columnHelper = createColumnHelper<Permission>();

export const PermissionsPage = () => {
	const {
		pageIndex,
		setPageIndex,
		pageSize,
		setPageSize,
		searchQuery,
		setSorting,
		sorting,
		setSearchQuery
	} = useTableState();

	const [opened, { open, close }] = useDisclosure(false);
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const { data, isLoading } = useQuery<Permission[]>({
		queryKey: ["permissions"],
		queryFn: getPermissions
	});

	const queryClient = useQueryClient();

	const deleteUserMutation = useMutation({
		mutationKey: ["permissions"],
		mutationFn: async (userId: string) => await deletePermission(userId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["permissions"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.permission_delete });
			closeDeleteModal();
		}
	});

	const handleDelete = (userId: string) => {
		setDeletingId(userId);
		openDeleteModal();
	};

	const onDelete = useCallback(() => {
		deletingId && deleteUserMutation.mutate(deletingId);
		setDeletingId(null);
	}, [deletingId]);

	const columns: ColumnDef<Permission>[] = [
		{
			header: "Permissions",
			footer: (props) => props.column.id,
			columns: [
				{
					accessorKey: "name",
					cell: (info) => <Link to={`/permissions/${info.row.original.name}`}>{info.getValue()}</Link>,
					footer: (props) => props.column.id
				},
				{
					accessorKey: "isActive",
					cell: (info) => (info.getValue() === true ? <IconCheck /> : <IconX />),
					footer: (props) => props.column.id,
					header: "Active"
				},
				{
					accessorKey: "description",
					cell: (info) => info.getValue(),
					footer: (props) => props.column.id
				},
				columnHelper.display({
					id: "actions",
					header: () => <span>Actions</span>,
					cell: ({ row }) => (
						<Button
							color="red"
							size="xs"
							onClick={() => row.original.name && handleDelete(row.original.name)}
						>
							Delete
						</Button>
					)
				})
			]
		}
	];

	return (
		<div>
			<DeleteModal
				opened={openedDelete}
				loading={deleteUserMutation.isLoading}
				onClose={closeDeleteModal}
				onDelete={onDelete}
			/>
			<Modal opened={opened} onClose={close} title="Create permission" centered>
				<PermissionCreate />
			</Modal>
			<DataTable
				data={data || []}
				isLoading={isLoading}
				open={open}
				columns={columns}
				// totalPages={data?.meta?.total}
				pageIndex={pageIndex}
				pageSize={pageSize}
				setPageIndex={setPageIndex}
				setSearchQuery={setSearchQuery}
			/>
		</div>
	);
};
