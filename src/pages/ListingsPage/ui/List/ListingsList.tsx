import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing, deleteListing, getListings } from "shared/api/listings";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { useTableState } from "shared/hooks/useTableState.ts";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";
import { ListingList } from "types/listings";

import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Sort } from "../../../SettingsPage/ui/ContactsPage";
import { listingTableColumns } from "../../columns.tsx";

export const ListingsPage = () => {
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
	const { pageIndex, setPageIndex, pageSize, sorting, setSorting, searchQuery, setSearchQuery } =
		useTableState();

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [deletingListingId, setDeletingListingId] = useState<string | null>(null);

	const { data, isLoading } = useQuery<ListingList>({
		queryKey: ["listings", pageIndex, pageSize, searchQuery, sorting],
		queryFn: () =>
			getListings({
				page: pageIndex,
				perPage: pageSize,
				search: searchQuery,
				sortBy: sorting.map((s: Sort) => s.id).join(""),
				sortOrder: sorting.map((s: Sort) => (s.desc ? 1 : -1)).join("")
			})
	});

	const { mutate, isLoading: isLoadingDeleteListing } = useMutation({
		mutationKey: ["listings"],
		mutationFn: async (listingId: string) => await deleteListing(listingId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["listings"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.listing_delete });
			closeDeleteModal();
		}
	});

	const { mutate: create, isLoading: isLoadingCreateListing } = useMutation({
		mutationKey: ["listings"],
		mutationFn: async () => await createListing(),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["listings"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.listing_create });
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const handleDelete = (listingId: string) => {
		setDeletingListingId(listingId);
		openDeleteModal();
	};

	const handleView = (id: string) => navigate(id);
	const handleCreate = () => create();

	const columns = listingTableColumns({
		handleDelete,
		deletingId: deletingListingId,
		handleView
	});

	const onDelete = useCallback(() => {
		deletingListingId && mutate(deletingListingId);
		setDeletingListingId(null);
	}, [deletingListingId, mutate]);

	return (
		<div>
			<DeleteModal
				opened={openedDelete}
				loading={isLoadingDeleteListing}
				onClose={closeDeleteModal}
				onDelete={onDelete}
			/>
			<DataTable
				isLoadingButton={isLoadingCreateListing}
				data={data?.list || []}
				isLoading={isLoading}
				handleDelete={handleDelete}
				open={handleCreate}
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
