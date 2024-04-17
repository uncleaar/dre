import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { getPermission, updatePermission } from "shared/api/permissions";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";

import { Box, Checkbox, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import styles from "./PermissionView.module.scss";

type FormValues = {
	permissions: Array<{ isAvailable: boolean }>;
};
export const PermissionView = () => {
	const { id } = useParams();

	const queryClient = useQueryClient();

	const { data, isLoading: isLoadingPermission } = useQuery({
		queryKey: ["permissions", id],
		queryFn: () => getPermission(id as string)
	});

	const { control, handleSubmit, watch } = useForm<FormValues, any>({
		defaultValues: {
			permissions: data?.permissions || []
		}
	});

	const permissionMutation = useMutation(
		(params: { permissionCode: string; newValue: boolean }) =>
			updatePermission(params.permissionCode, params.newValue),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["permissions", id]);
				notifications.show({ title: "Success", message: SUCCESS_MESSAGES.permission_update });
			},
			onError: (error) => {
				notifications.show({ title: "Error", message: "Failed to update permission" });
			}
		}
	);
	const handlePermissionChange = (permissionCode: string, newValue: boolean) => {
		permissionMutation.mutate({ permissionCode, newValue });
	};

	return (
		<div>
			{isLoadingPermission ? (
				<LoadingOverlay />
			) : (
				<Box component="form">
					{data?.permissions?.map((permission, index) => (
						<Controller
							control={control}
							name={`permissions[${index}].isAvailable`}
							key={permission.code}
							render={({ field }) => {
								return (
									<>
										<Checkbox
											mt="xs"
											ml={33}
											label={permission.name}
											checked={permission.isAvailable}
											onChange={(e) => {
												field.onChange(e.target.checked);
												handlePermissionChange(permission.role, { [permission.code]: e.target.checked });
											}}
										/>
									</>
								);
							}}
						/>
					))}
				</Box>
			)}
		</div>
	);
};
