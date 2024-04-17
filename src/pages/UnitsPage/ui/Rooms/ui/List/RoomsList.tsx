import dayjs from "dayjs";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
	deleteListingPublicationRoom,
	getListingPublicationsRooms
} from "shared/api/listing-publications-rooms";
import { deleteRoom, getRooms } from "shared/api/rooms";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { useTableState } from "shared/hooks/useTableState";
import usePublicationStore from "shared/stores/publications/usePublicationStore";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ListingPublicationRoomCreate } from "../../../../../ListingsPage/ui/ListingPublications/ui/ListingPublicationRoomCreate/ListingPublicationRoomCreate";
import { roomsTableColumns } from "../../columns";
import { roomModals } from "../../modals";

type Actions = "create" | "update" | "view";

interface RoomsListProps {
	unitId?: string;
	listingId?: string;
}

export const RoomsList: FC<RoomsListProps> = ({ unitId, listingId }: RoomsListProps) => {
	const [opened, { open: open, close: close }] = useDisclosure(false);
	const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
	const [openedListingRoom, { open: openListingRoomModal, close: closeListingRoomModal }] =
		useDisclosure(false);
	const [action, setAction] = useState<Actions | null>(null);
	const [roomId, setRoomId] = useState<string>("");
	const { setPublicationStoreData } = usePublicationStore();

	const queryClient = useQueryClient();
	const {
		pageIndex,
		setPageIndex,
		pageSize,
		setPageSize,
		sorting,
		setSorting,
		searchQuery,
		setSearchQuery
	} = useTableState();

	const { data, isLoading } = useQuery({
		queryKey: [
			!listingId ? "rooms" : "listing-publication-rooms",
			pageIndex,
			pageSize,
			sorting,
			searchQuery,
			listingId
		],
		queryFn: () =>
			!listingId
				? getRooms({
						page: pageIndex,
						perPage: pageSize,
						search: searchQuery,
						sortBy: sorting.map((s) => s.id).join(""),
						sortOrder: sorting.map((s) => (s.desc ? 1 : -1)).join(""),
						...(unitId ? { unitId: [unitId] } : {})
					})
				: getListingPublicationsRooms({
						page: pageIndex,
						perPage: pageSize,
						search: searchQuery,
						listingPublicationId: listingId as string,
						sortBy: sorting.map((s) => s.id).join(""),
						sortOrder: sorting.map((s) => (s.desc ? 1 : -1)).join("")
					})
	});

	const { mutate, isLoading: isLoadingDelete } = useMutation({
		mutationKey: ["rooms"],
		mutationFn: async (id: string) => await deleteRoom(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["rooms"] });
			closeDeleteModal();
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.room_delete });
		}
	});

	const { mutate: mutateDeleteRoomPublication, isLoading: isLoadingDeleteRoomPublication } =
		useMutation({
			mutationKey: ["listing-publication-rooms-delete"],
			mutationFn: async (id: string) => await deleteListingPublicationRoom(listingId as string, id),
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: ["listing-publication-rooms"] });
				closeDeleteModal();
				notifications.show({ title: "Success", message: SUCCESS_MESSAGES.room_delete });
			}
		});
	useEffect(() => {
		if (listingId && data) {
			setPublicationStoreData({ rooms: data.list });
		}
	}, [data, listingId, setPublicationStoreData]);
	const handleCreate = () => {
		setAction("create");
		listingId ? openListingRoomModal() : open();
	};

	const handleUpdate = (id: string) => {
		setAction("update");
		setRoomId(id);
		open();
	};

	const handleDelete = (id: string) => {
		setRoomId(id);
		openDeleteModal();
	};
	const onDelete = useCallback(() => {
		if (!listingId) {
			roomId && mutate(roomId);
			setRoomId("");
		} else {
			roomId && mutateDeleteRoomPublication(roomId);
		}
	}, [listingId, mutate, mutateDeleteRoomPublication, roomId]);

	const handleView = (id: string) => {
		setAction("view");
		setRoomId(id);
		open();
	};

	const onClose = () => {
		setAction(null);
		setRoomId("");
		close();
	};

	const renderModal = () => {
		if (action) {
			const ModalComponent = roomModals[action].component;
			const modalProps: any = {};
			if (action === "view") {
				modalProps.roomId = roomId;
				modalProps.onClose = onClose;
				modalProps.listingId = listingId;
			}
			if (action === "update") {
				modalProps.roomId = roomId;
				modalProps.onClose = onClose;
				modalProps.isEdit = true;
				modalProps.listingId = listingId;
			}
			if (action === "create") {
				modalProps.onClose = onClose;
				modalProps.unitId = unitId;
				modalProps.isEdit = false;
			}

			return (
				<div>
					<ModalComponent {...modalProps} />
				</div>
			);
		}
	};

	const columns = roomsTableColumns({
		handleUpdate,
		handleDelete,
		handleView
	});

	const roomsData = useMemo(() => {
		if (data) {
			return data?.list.map((item) => ({
				...item,
				availability: dayjs(item?.availability).format("YYYY-MM-DD")
			}));
		}
		return [];
	}, [data]);

	return (
		<div>
			<DeleteModal
				opened={openedDelete}
				loading={isLoadingDelete}
				onClose={closeDeleteModal}
				onDelete={onDelete}
			/>
			{listingId && (
				<Modal
					className="modal"
					opened={!!listingId && openedListingRoom}
					onClose={closeListingRoomModal}
					title="Add room listing"
					centered
				>
					<ListingPublicationRoomCreate id={listingId} close={closeListingRoomModal} />
				</Modal>
			)}
			<div>
				<DataTable
					sorting={sorting}
					open={handleCreate}
					setSorting={setSorting}
					totalPages={data?.list?.length}
					pageIndex={pageIndex}
					pageSize={pageSize}
					data={roomsData || []}
					columns={columns}
					isLoading={isLoading}
					setPageIndex={setPageIndex}
					setSearchQuery={setSearchQuery}
					buttonName={listingId ? "Add room" : "Create room"}
				/>
			</div>
			<Modal
				opened={opened}
				onClose={onClose}
				centered
				size={action ? roomModals[action]?.size : "50%"}
			>
				<Modal.Body>{renderModal()}</Modal.Body>
			</Modal>
		</div>
	);
};
