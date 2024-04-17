import React, { useEffect, useState } from "react";
import {
	createProspect,
	deleteProspect,
	getProspectsByPublicationId
} from "shared/api/prospects.ts";
import { useTableState } from "shared/hooks/useTableState.ts";
import usePublicationStore from "shared/stores/publications/usePublicationStore.ts";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal.tsx";

import { Modal, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PublicationTabList } from "../../Tabs/PublicationTabList.tsx";
import { prospectsTableColumns } from "../columns.tsx";

import { CreateProspect } from "./CreateProspect.tsx";
import { ViewProspect } from "./ViewProspect.tsx";

export const ProspectsList = () => {
	const { selectedPubTab } = usePublicationStore();
	const queryClient = useQueryClient();

	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
	const [opened, { open, close }] = useDisclosure(false);
	const [deleteId, setDeleteId] = useState("");
	const [viewOrEdit, setViewOrEdit] = useState("");
	const [isEdit, setIsEdit] = useState(false);
	const { pageIndex, setPageIndex, pageSize, sorting, setSorting, searchQuery, setSearchQuery } =
		useTableState();
	const { data: prospects, isLoading } = useQuery<any>({
		queryKey: ["prospects", selectedPubTab],
		queryFn: async () => await getProspectsByPublicationId(selectedPubTab as string),
		enabled: !!selectedPubTab
	});
	const { mutate, isLoading: isLoadingDeleteBuilding } = useMutation({
		mutationKey: ["prospects"],
		mutationFn: async (id: string) => await deleteProspect(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["prospects"] });
			closeDeleteModal();
			notifications.show({ title: "Success", message: "OK" });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while deleting a prospect."
			});
		}
	});
	useEffect(() => {
		setIsEdit(false);
		setViewOrEdit("");
	}, [selectedPubTab]);
	const handleDelete = (id: string) => {
		setDeleteId(id);
		openDeleteModal();
	};
	const handleUpdate = (id: string) => {
		setIsEdit(true);
		setViewOrEdit(id);
	};
	const handleView = (id: string) => {
		setIsEdit(false);
		setViewOrEdit(id);
	};

	const onDelete = () => {
		if (deleteId) {
			mutate(deleteId);
		}
	};
	const columns = prospectsTableColumns({ handleView, handleDelete, handleUpdate });

	return (
		<div>
			<DeleteModal
				opened={openedDelete}
				loading={isLoadingDeleteBuilding}
				onClose={closeDeleteModal}
				onDelete={onDelete}
			/>
			<Tabs m="lg" variant="outline">
				<PublicationTabList isLoading={false} onSubmit={open} tooltip={"Create prospect"} />
			</Tabs>
			<Modal opened={opened} onClose={close} title="Create Prospect" size="lg">
				<CreateProspect onClose={close} />
			</Modal>
			{!prospects ? null : (
				<DataTable
					data={prospects?.list}
					totalPages={prospects?.meta?.total}
					isLoading={isLoading}
					open={open}
					columns={columns}
					pageIndex={pageIndex}
					pageSize={pageSize}
					sorting={sorting}
					setSorting={setSorting}
					setPageIndex={setPageIndex}
					setSearchQuery={setSearchQuery}
				/>
			)}
			{!viewOrEdit ? null : <ViewProspect setEdit={setIsEdit} prospectId={viewOrEdit} edit={isEdit} />}
		</div>
	);
};
