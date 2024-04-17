import React, { FC, useCallback, useState } from "react";
import { deleteContact, getContacts } from "shared/api/settings";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { useTableState } from "shared/hooks/useTableState";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";
import { Contact } from "types/contact";
import { Contacts } from "types/contacts";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { contactsTableColumns } from "../../columns";
import { CreateContactOrUpdate } from "../CreateOrUpdate/CreateContactOrUpdate";

interface ContactsPageProps {}

export type Sort = {
	desc: boolean;
	id: string;
};

export const ContactsPage: FC<ContactsPageProps> = () => {
	const queryClient = useQueryClient();

	const { pageIndex, setPageIndex, pageSize, searchQuery, setSorting, sorting, setSearchQuery } =
		useTableState();

	const [editContact, setEditContact] = useState<Contact | null>(null);

	const [openedCreateOrUpdate, { open: openCreateOrUpdateModal, close: closeCreateOrUpdateModal }] =
		useDisclosure(false);
	const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

	const { data, isLoading } = useQuery<Contacts>({
		queryKey: ["contacts", pageIndex, pageSize, searchQuery, sorting, sorting],
		queryFn: () =>
			getContacts({
				page: pageIndex,
				perPage: pageSize,
				search: searchQuery,
				sortBy: sorting.map((s: Sort) => s.id).join(""),
				sortOrder: sorting.map((s: Sort) => (s.desc ? 1 : -1)).join("")
			}),
		keepPreviousData: true
	});

	const { mutate, isLoading: isLoadingDeleteContact } = useMutation({
		mutationKey: ["contacts"],
		mutationFn: async (id: string) => await deleteContact(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["contacts"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.contact_delete });
			closeDeleteModal();
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const handleDelete = (id: string) => {
		setDeletingContactId(id);
		openDeleteModal();
	};

	const handleUpdate = (id: string) => {
		openCreateOrUpdateModal();
		const currentContact = data?.list.find((item) => item.id === id);
		setEditContact(currentContact ?? null);
	};

	const onCloseCreateOrUpdateModal = () => {
		setEditContact(null);
		closeCreateOrUpdateModal();
	};

	const onDelete = useCallback(() => {
		deletingContactId && mutate(deletingContactId);
		setDeletingContactId(null);
	}, [deletingContactId]);

	const columns = contactsTableColumns({
		handleDelete,
		deletingId: deletingContactId,
		handleUpdate
	});

	return (
		<div>
			<Modal
				opened={openedCreateOrUpdate}
				onClose={onCloseCreateOrUpdateModal}
				title={`${editContact ? "Update" : "Create"} contact`}
				centered
			>
				<CreateContactOrUpdate onClose={onCloseCreateOrUpdateModal} edit={editContact} />
			</Modal>
			<DeleteModal
				opened={openedDelete}
				loading={isLoadingDeleteContact}
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
