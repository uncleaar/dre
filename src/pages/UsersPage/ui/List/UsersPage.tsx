import { useMemo, useState } from "react";
import { deleteUser, getUsers } from "shared/api/users";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { useTableState } from "shared/hooks/useTableState";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ListUsers, User, UserRoles } from "../../../../types/user";
import { Sort } from "../../../SettingsPage/ui/ContactsPage";
import { userTableColumns } from "../../columns";
import { CreateOrUpdateUser } from "../CreateOrUpdate/CreateOrUpdateUser";

export const UsersPage = () => {
	const { pageIndex, setPageIndex, pageSize, sorting, setSorting, searchQuery, setSearchQuery } =
		useTableState();

	const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
	const [opened, { open, close }] = useDisclosure(false);
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
	const [editUser, setEditUser] = useState<User | null>(null);
	const [filter, setFilter] = useState<string[]>([]);

	const { data, isLoading } = useQuery<ListUsers>({
		queryKey: ["users", pageIndex, pageSize, searchQuery, sorting, filter],
		queryFn: () =>
			getUsers({
				page: pageIndex,
				perPage: pageSize,
				search: searchQuery,
				sortBy: sorting.map((s: Sort) => s.id).join(""),
				sortOrder: sorting.map((s: Sort) => (s.desc ? 1 : -1)).join(""),
				...(filter.length ? { role: filter } : {})
			}),
		keepPreviousData: true
	});

	const queryClient = useQueryClient();

	const { mutate, isLoading: isLoadingDeleteUser } = useMutation({
		mutationKey: ["users"],
		mutationFn: async (userId: string) => await deleteUser(userId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["users"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.user_delete });
			closeDeleteModal();
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const handleDelete = (userId: string) => {
		setDeletingUserId(userId);
		openDeleteModal();
	};

	const onCloseCreateOrUpdateModal = () => {
		setEditUser(null);
		close();
	};

	const handleUpdate = (id: string) => {
		open();
		const current = data?.list.find((item) => item.id === id);
		setEditUser(current ?? null);
	};

	const onDelete = () => {
		deletingUserId && mutate(deletingUserId);
		setDeletingUserId(null);
	};

	const columns = userTableColumns({
		handleDelete,
		deletingId: deletingUserId,
		handleUpdate
	});

	const userRoles = useMemo(() => {
		return Object.values(UserRoles);
	}, [UserRoles]);

	return (
		<>
			<Modal
				opened={opened}
				onClose={onCloseCreateOrUpdateModal}
				title={`${editUser ? "Update" : "Create"} user`}
				centered
			>
				<CreateOrUpdateUser onClose={close} edit={editUser} />
			</Modal>
			<DeleteModal
				opened={openedDelete}
				loading={isLoadingDeleteUser}
				onClose={closeDeleteModal}
				onDelete={onDelete}
			/>
			<DataTable
				data={data?.list || []}
				isLoading={isLoading}
				handleDelete={handleDelete}
				open={open}
				sorting={sorting}
				setSorting={setSorting}
				columns={columns}
				totalPages={data?.meta?.total}
				pageIndex={pageIndex}
				pageSize={pageSize}
				setPageIndex={setPageIndex}
				setSearchQuery={setSearchQuery}
				setFilter={setFilter}
				filter={{
					title: "Role",
					data: userRoles
				}}
			/>
		</>
	);
};
