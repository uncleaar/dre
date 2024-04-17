import React, { useCallback, useState } from "react";
import { deleteAmenity, getAmenities } from "shared/api/settings";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { useTableState } from "shared/hooks/useTableState";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Amenities, Amenity } from "../../../../../../types/amenities";
import { Sort } from "../../../ContactsPage";
import { amenitiesTableColumns } from "../../columns";
import { CreateAmenityOrUpdate } from "../CreateOrUpdate/CreateAmenityOrUpdate";

export const AmenitiesPage = () => {
	const { pageIndex, setPageIndex, pageSize, searchQuery, setSearchQuery, sorting, setSorting } =
		useTableState();
	const [editAmenity, setEditAmenity] = useState<Amenity | null>(null);
	const [deletingAmenityId, setDeletingAmenityId] = useState<string | null>(null);
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
	const [openedCreateOrUpdate, { open: openCreateOrUpdateModal, close: closeCreateOrUpdateModal }] =
		useDisclosure(false);

	const { data, isLoading } = useQuery<Amenities>({
		queryKey: ["amenities", pageIndex, pageSize, searchQuery, sorting, sorting],
		queryFn: () =>
			getAmenities({
				page: pageIndex,
				perPage: pageSize,
				search: searchQuery,
				sortBy: sorting.map((s: Sort) => s.id).join(""),
				sortOrder: sorting.map((s: Sort) => (s.desc ? 1 : -1)).join("")
			}),
		keepPreviousData: true
	});

	const queryClient = useQueryClient();

	const { mutate, isLoading: isLoadingDeleteAmenity } = useMutation({
		mutationKey: ["amenities"],
		mutationFn: async (id: string) => await deleteAmenity(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["amenities"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.amenity_delete });
			closeDeleteModal();
		}
	});

	const handleDelete = (id: string) => {
		setDeletingAmenityId(id);
		openDeleteModal();
	};

	const onDelete = useCallback(() => {
		deletingAmenityId && mutate(deletingAmenityId);
		setDeletingAmenityId(null);
	}, [deletingAmenityId]);

	const onCloseCreateOrUpdateModal = () => {
		setEditAmenity(null);
		closeCreateOrUpdateModal();
	};

	const handleUpdate = (id: string) => {
		openCreateOrUpdateModal();
		const current = data?.list.find((item) => item.id === id);
		setEditAmenity(current ?? null);
	};

	const columns = amenitiesTableColumns({
		handleDelete,
		deletingId: deletingAmenityId,
		handleUpdate
	});

	return (
		<>
			<Modal
				opened={openedCreateOrUpdate}
				onClose={onCloseCreateOrUpdateModal}
				title={`${editAmenity ? "Update" : "Create"} amenity`}
				centered
			>
				<CreateAmenityOrUpdate onClose={onCloseCreateOrUpdateModal} edit={editAmenity} />
			</Modal>
			<DeleteModal
				opened={openedDelete}
				loading={isLoadingDeleteAmenity}
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
		</>
	);
};
