import React, { FC, useCallback, useState } from "react";
import { deleteUtility, getUtilities } from "shared/api/settings";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { useTableState } from "shared/hooks/useTableState";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Utilities, Utility } from "../../../../../../types/utilities";
import { contactsTableColumns } from "../../columns";
import { CreateUtilityOrUpdate } from "../CreateOrUpdate/CreateOrUpdateUtility";

interface ContactsPageProps {}

export type Sort = {
	desc: boolean;
	id: string;
};

export const UtilitiesPage: FC<ContactsPageProps> = () => {
	const queryClient = useQueryClient();
	const { pageIndex, setPageIndex, pageSize, sorting, setSorting, searchQuery, setSearchQuery } =
		useTableState();

	const [editUtility, setEditUtility] = useState<Utility | null>(null);
	const [openedCreateOrUpdate, { open: openCreateOrUpdateModal, close: closeCreateOrUpdateModal }] =
		useDisclosure(false);
	const [deletingUtilityId, setDeletingUtilityId] = useState<string | null>(null);
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

	const { data, isLoading } = useQuery<Utilities>({
		queryKey: ["utilities", pageIndex, pageSize, searchQuery, sorting, sorting],
		queryFn: () =>
			getUtilities({
				page: pageIndex,
				perPage: pageSize,
				search: searchQuery,
				sortBy: sorting.map((s: Sort) => s.id).join(""),
				sortOrder: sorting.map((s: Sort) => (s.desc ? 1 : -1)).join("")
			}),
		keepPreviousData: true
	});

	const { mutate, isLoading: isLoadingDeleteUtility } = useMutation({
		mutationKey: ["utilities"],
		mutationFn: async (id: string) => await deleteUtility(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["utilities"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.utility_delete });
			closeDeleteModal();
		}
	});

	const handleDelete = (id: string) => {
		setDeletingUtilityId(id);
		openDeleteModal();
	};

	const handleUpdate = (id: string) => {
		openCreateOrUpdateModal();
		const current = data?.list.find((item) => item.id === id);
		setEditUtility(current ?? null);
	};

	const onCloseCreateOrUpdateModal = () => {
		setEditUtility(null);
		closeCreateOrUpdateModal();
	};

	const onDelete = useCallback(() => {
		deletingUtilityId && mutate(deletingUtilityId);
		setDeletingUtilityId(null);
	}, [deletingUtilityId]);

	const columns = contactsTableColumns({
		handleDelete,
		deletingId: deletingUtilityId,
		handleUpdate
	});

	return (
		<div>
			<Modal
				opened={openedCreateOrUpdate}
				onClose={onCloseCreateOrUpdateModal}
				title={`${editUtility ? "Update" : "Create"} utility`}
				centered
			>
				<CreateUtilityOrUpdate onClose={onCloseCreateOrUpdateModal} edit={editUtility} />
			</Modal>
			<DeleteModal
				opened={openedDelete}
				loading={isLoadingDeleteUtility}
				onClose={closeDeleteModal}
				onDelete={onDelete}
			/>
			<DataTable
				data={data?.list || []}
				isLoading={isLoading}
				handleDelete={handleDelete}
				open={openCreateOrUpdateModal}
				sorting={sorting}
				setSorting={setSorting}
				columns={columns}
				totalPages={data?.meta?.total}
				pageIndex={pageIndex}
				pageSize={pageSize}
				setPageIndex={setPageIndex}
				setSearchQuery={setSearchQuery}
			/>
		</div>
	);
};
