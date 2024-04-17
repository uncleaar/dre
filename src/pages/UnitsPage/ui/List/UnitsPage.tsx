import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	deleteListingPublicationUnit,
	getListingPublicationsUnits
} from "shared/api/listing-publications-units";
import { deleteUnit, getUnits } from "shared/api/units";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { useTableState } from "shared/hooks/useTableState";
import usePublicationStore from "shared/stores/publications/usePublicationStore";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Units, UnitStatuses } from "../../../../types/unit";
import { ListingPublicationUnitCreate } from "../../../ListingsPage/ui/ListingPublications/ui/ListingPublicationUnitCreate/ListingPublicationUnitCreate";
import { unitsTableColumns } from "../../columns";

interface UnitsPageProps {
	listingId?: string;
}
export const UnitsPage = ({ listingId }: UnitsPageProps) => {
	const [opened, { open, close }] = useDisclosure(false);
	const [filter, setFilter] = useState<string[]>([]);
	const { setPublicationStoreData } = usePublicationStore();

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { pageIndex, setPageIndex, pageSize, sorting, setSorting, searchQuery, setSearchQuery } =
		useTableState();

	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

	const { data, isLoading } = useQuery({
		queryKey: [
			!listingId ? "units" : "listing-publication-units",
			pageIndex,
			pageSize,
			sorting,
			searchQuery,
			listingId,
			filter
		],
		queryFn: () =>
			!listingId
				? getUnits({
						page: pageIndex,
						perPage: pageSize,
						search: searchQuery,
						sortBy: sorting.map((s) => s.id).join(""),
						sortOrder: sorting.map((s) => (s.desc ? 1 : -1)).join(""),
						buildingId: [],
						...(filter.length ? { status: filter } : {})
					})
				: getListingPublicationsUnits({
						page: pageIndex,
						perPage: pageSize,
						search: searchQuery,
						listingPublicationId: listingId as string,
						sortBy: sorting.map((s) => s.id).join(""),
						sortOrder: sorting.map((s) => (s.desc ? 1 : -1)).join(""),
						...(filter.length ? { status: filter } : {})
					})
	});

	const { mutate: mutateDeleteUnit, isLoading: isLoadingDeleteUnit } = useMutation({
		mutationKey: ["units"],
		mutationFn: async (id: string) => await deleteUnit(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["units"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.unit_delete });
			closeDeleteModal();
		}
	});

	const { mutate: mutateDeleteUnitPublication, isLoading: isLoadingDeleteUnitPublication } =
		useMutation({
			mutationKey: ["listing-publication-units-delete"],
			mutationFn: async (id: string) => await deleteListingPublicationUnit(listingId as string, id),
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: ["listing-publication-units"] });
				closeDeleteModal();
				notifications.show({ title: "Success", message: SUCCESS_MESSAGES.unit_delete });
			}
		});

	const handleDelete = (id: string) => {
		setDeletingId(id);
		openDeleteModal();
	};
	useEffect(() => {
		if (listingId && data) {
			setPublicationStoreData({ units: data.list });
		}
	}, [data]);

	const handleUpdate = (id: string) =>
		navigate(!listingId ? `update/${id}` : `/listing-publications/${listingId}/update-unit/${id}`);

	const handleView = (id: string) =>
		navigate(!listingId ? id : `/listing-publications/${listingId}/units/${id}`);

	const columns = unitsTableColumns({
		handleDelete,
		deletingId,
		handleUpdate,
		handleView
	});

	const onDelete = useCallback(() => {
		if (!listingId) {
			deletingId && mutateDeleteUnit(deletingId);
			setDeletingId(deletingId);
		} else {
			deletingId && mutateDeleteUnitPublication(deletingId);
		}
		setDeletingId(null);
	}, [deletingId]);

	const handleCreate = () => navigate("new");

	const onCloseCreateOrUpdateModal = () => {
		close();
	};
	const unitStatuses = useMemo(() => {
		return Object.values(UnitStatuses);
	}, [UnitStatuses]);
	return (
		<div>
			<DeleteModal
				opened={openedDelete}
				loading={isLoadingDeleteUnit}
				onClose={closeDeleteModal}
				onDelete={onDelete}
			/>

			{listingId && (
				<Modal
					className="modal"
					opened={opened}
					onClose={onCloseCreateOrUpdateModal}
					title="Add unit listing"
					centered
				>
					<ListingPublicationUnitCreate id={listingId} close={onCloseCreateOrUpdateModal} />
				</Modal>
			)}

			<DataTable
				sorting={sorting}
				open={!listingId ? handleCreate : open}
				setSorting={setSorting}
				totalPages={data?.meta?.total}
				pageIndex={pageIndex}
				pageSize={pageSize}
				data={data?.list || []}
				columns={columns}
				isLoading={isLoading}
				setPageIndex={setPageIndex}
				setSearchQuery={setSearchQuery}
				buttonName={listingId ? "Add unit" : "Create unit"}
				setFilter={setFilter}
				filter={{
					title: "Status",
					data: unitStatuses
				}}
			/>
		</div>
	);
};
