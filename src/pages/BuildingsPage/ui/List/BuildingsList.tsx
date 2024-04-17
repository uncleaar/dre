import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBuilding, deleteBuilding, getBuildings } from "shared/api/buildings";
import {
	deleteListingPublicationBuilding,
	getListingPublicationsBuildings
} from "shared/api/listing-publications-buildings";
import { ROUTES } from "shared/constants";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { useTableState } from "shared/hooks/useTableState";
import { transformErrorMessages } from "shared/lib/transformErrorMessages";
import usePublicationStore from "shared/stores/publications/usePublicationStore";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";

import { Modal } from "@mantine/core";
import { Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NotificationData, notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { BuildingStatuses } from "../../../../types/building";
import { ListingPublicationBuildingCreate } from "../../../ListingsPage/ui/ListingPublications/ui/ListingPublicationBuildingCreate/ListingPublicationBuildingCreate";
import { buildingsTableColumns } from "../../columns";

import styles from "./BuildingList.module.scss";

interface BuildingsPageProps {
	listingId?: string;
}
export const BuildingsPage: FC<BuildingsPageProps> = ({ listingId }) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [filter, setFilter] = useState<string[]>([]);
	const { setPublicationStoreData } = usePublicationStore();
	const { pageIndex, setPageIndex, pageSize, sorting, setSorting, searchQuery, setSearchQuery } =
		useTableState();
	const [opened, { open, close }] = useDisclosure(false);

	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

	const [deletingBuildingId, setDeletingBuildingId] = useState<string | null>(null);

	const { data, isLoading, refetch } = useQuery({
		queryKey: [
			!listingId ? "buildings" : "listing-publication-buildings",
			pageIndex,
			pageSize,
			sorting,
			searchQuery,
			listingId,
			filter
		],
		queryFn: () =>
			!listingId
				? getBuildings({
						page: pageIndex,
						perPage: pageSize,
						sortBy: sorting.map((s) => s.id).join(""),
						sortOrder: sorting.map((s) => (s.desc ? 1 : -1)).join(""),
						search: searchQuery,
						...(filter.length ? { occupancyStatus: filter } : {})
					})
				: getListingPublicationsBuildings({
						page: pageIndex,
						perPage: pageSize,
						search: searchQuery,
						listingPublicationId: listingId,
						sortBy: sorting.map((s) => s.id).join(""),
						sortOrder: sorting.map((s) => (s.desc ? 1 : -1)).join(""),
						...(filter.length ? { occupancyStatus: filter } : {})
					}),
		keepPreviousData: true
	});

	const { mutate, isLoading: isLoadingDeleteBuilding } = useMutation({
		mutationKey: ["buildings"],
		mutationFn: async (buildingId: string) => await deleteBuilding(buildingId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["buildings"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.building_delete });
			closeDeleteModal();
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while deleting building",
				color: "red"
			} as NotificationData);
		}
	});

	const { mutate: deleteListingBuilding } = useMutation({
		mutationKey: ["listing-publication-buildings"],
		mutationFn: async (buildingId: string) =>
			await deleteListingPublicationBuilding(listingId as string, buildingId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["listing-publication-buildings"] });
			closeDeleteModal();
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.building_delete });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while deleting building",
				color: "red"
			} as NotificationData);
		}
	});

	const {
		mutate: create,
		data: createData,
		isLoading: isCreateLoading
	} = useMutation({
		mutationKey: ["buildings"],
		mutationFn: async (data: { name: string }) => await createBuilding(data),
		onSuccess: async () => {
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.building_create });
			navigate(ROUTES.BUILDINGS);
		},
		onError: (error) => {
			transformErrorMessages(error);
			navigate(ROUTES.BUILDINGS);
		}
	});
	useEffect(() => {
		if (createData) {
			navigate(`update/${createData.id}`);
		}
	}, [createData]);

	const handleDelete = (id: string) => {
		setDeletingBuildingId(id);
		openDeleteModal();
	};
	const handleCreate = () => {
		create({ name: "new building" });
	};

	const handleUpdate = (id: string) =>
		navigate(
			!listingId ? `update/${id}` : `/listing-publications/${listingId}/update-building/${id}`
		);

	useEffect(() => {
		if (listingId && data) {
			setPublicationStoreData({ buildings: data.list });
		}
	}, [data]);

	const handleView = (id: string) =>
		navigate(!listingId ? id : `/listing-publications/${listingId}/buildings/${id}`);

	useEffect(() => {
		refetch();
	}, [pageIndex]);

	const occupancyStatus = useMemo(() => {
		return Object.values(BuildingStatuses);
	}, [BuildingStatuses]);

	const onDelete = useCallback(() => {
		if (!listingId) {
			deletingBuildingId && mutate(deletingBuildingId);
			setDeletingBuildingId(deletingBuildingId);
		} else {
			deletingBuildingId && deleteListingBuilding(deletingBuildingId);
		}
		setDeletingBuildingId(null);
	}, [deletingBuildingId]);

	const columns = buildingsTableColumns({ handleUpdate, handleDelete, handleView });

	if (isLoading || isCreateLoading)
		return <Loader classNames={{ root: styles.loader }} color="blue" />;

	return (
		<div>
			<DeleteModal
				opened={openedDelete}
				loading={isLoadingDeleteBuilding}
				onClose={closeDeleteModal}
				onDelete={onDelete}
			/>

			{listingId && (
				<Modal opened={opened} onClose={close} title="Add building listing" centered>
					<ListingPublicationBuildingCreate id={listingId} close={close} />
				</Modal>
			)}

			<DataTable
				data={data?.list || []}
				columns={columns}
				isLoading={isLoading}
				totalPages={data?.meta?.total}
				pageIndex={pageIndex}
				pageSize={pageSize}
				open={!listingId ? handleCreate : open}
				sorting={sorting}
				setSorting={setSorting}
				setPageIndex={setPageIndex}
				setSearchQuery={setSearchQuery}
				buttonName={listingId ? "Add building" : "Create building"}
				setFilter={setFilter}
				filter={{
					title: "Occupancy Status",
					data: occupancyStatus
				}}
			/>
		</div>
	);
};
