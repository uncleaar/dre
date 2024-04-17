import dayjs from "dayjs";
import React, { FC, useMemo, useState } from "react";
import { deleteAppointment, getAppointments } from "shared/api/appointments.ts";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages.ts";
import { useTableState } from "shared/hooks/useTableState.ts";
import { DataTable } from "shared/ui";
import { DeleteModal } from "shared/ui/DeleteModal/DeleteModal.tsx";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Appointment, Appointments } from "../../../../types/appointments.ts";
import { Sort } from "../../../SettingsPage/ui/ContactsPage";
import { appointmentsTableColumns } from "../columns.tsx";
import { CreateOrUpdateAppointment } from "../CreateOrUpdate/CreateOrUpdateAppointment.tsx";
import { AppointmentView } from "../View/AppointmentView.tsx";

interface AppointmentsListProps {}
export const AppointmentsList: FC<AppointmentsListProps> = () => {
	const { pageIndex, setPageIndex, pageSize, searchQuery, setSearchQuery, sorting, setSorting } =
		useTableState();
	const [opened, { open, close }] = useDisclosure(false);
	const [openedView, { open: openView, close: closeView }] = useDisclosure(false);
	const [openedDeleteModal, { open: openDelete, close: closeDelete }] = useDisclosure(false);
	const [deletingId, setDeletingId] = useState("");
	const [updateId, setUpdateId] = useState("");
	const [viewId, setViewId] = useState("");
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery<Appointments>({
		queryKey: ["appointments"],
		queryFn: async () =>
			getAppointments({
				page: pageIndex,
				perPage: pageSize,
				search: searchQuery,
				sortBy: sorting.map((s: Sort) => s.id).join(""),
				sortOrder: sorting.map((s: Sort) => (s.desc ? 1 : -1)).join("")
			})
	});

	const { mutate, isLoading: isLoadingDelete } = useMutation({
		mutationKey: ["appointments"],
		mutationFn: async (id: string) => await deleteAppointment(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["appointments"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.appointment_delete });
			closeDelete();
		}
	});
	const handleDelete = (id: string) => {
		setDeletingId(id);
		openDelete();
	};
	const handleUpdate = (id: string) => {
		setUpdateId(id);
		open();
	};
	const handleView = (id: string) => {
		setViewId(id);
		openView();
	};

	const columns = appointmentsTableColumns({
		handleDelete,
		deletingId,
		handleUpdate,
		handleView
	});
	const onDelete = () => {
		if (deletingId) {
			mutate(deletingId);
		}
	};
	const onClose = () => {
		setUpdateId("");
		close();
	};

	const appointmentsData = useMemo(() => {
		let result: Appointment[] = [];
		if (data?.list) {
			result = data.list.map((app) => {
				return {
					...app,
					date: dayjs(app.date).format("YYYY MMMM DD, hh:mm A")
				};
			});
		}
		return result;
	}, [data]);

	return (
		<div>
			<Modal opened={opened} onClose={onClose} title="Add Appointment">
				<CreateOrUpdateAppointment appointmentId={updateId} onClose={onClose} />
			</Modal>
			<Modal opened={openedView} onClose={closeView} title="View Appointment">
				<AppointmentView appointmentId={viewId} />
			</Modal>
			<DeleteModal
				opened={openedDeleteModal}
				loading={isLoadingDelete}
				onClose={closeDelete}
				onDelete={onDelete}
			/>
			<DataTable
				data={appointmentsData}
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
			/>
		</div>
	);
};
