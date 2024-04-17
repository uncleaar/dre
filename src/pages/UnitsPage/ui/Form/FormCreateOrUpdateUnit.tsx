import React, { FC, useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { getBuildings } from "shared/api/buildings.ts";
import { updateUnitStatus, UpdateUnitStatusProps } from "shared/api/units";
import { FeeTypesOptions } from "shared/constants/rooms/room-constants-options.ts";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { Input, SelectInput } from "shared/ui";

import { Box, Checkbox, Flex, Grid, InputWrapper, SimpleGrid, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { Building } from "../../../../types/building";
import { UnitStatuses } from "../../../../types/unit";
import { AsyncSelectPaginate } from "../../../../widgets/AsyncSelectPaginate/AsyncSelectPaginate";

import styles from "../CreateOrUpdate/CreateUnit.module.scss";

interface FormCreateOrUpdateUnitProps {
	edit?: boolean;
	name?: string;
	listingId?: string;
}

export const FormCreateOrUpdateUnit: FC<FormCreateOrUpdateUnitProps> = ({
	edit,
	name,
	listingId
}) => {
	const { id } = useParams();
	const [status, setStatus] = useState<{ value: string; label: string } | null>(null);
	const {
		control,
		formState: { errors, defaultValues }
	} = useFormContext();
	const { mutate: updateStatus, isLoading } = useMutation({
		mutationFn: async (data: UpdateUnitStatusProps) => await updateUnitStatus(data, id as string),
		onSuccess: async () => {
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.unit_update_status });
		},
		onError: (error: any) => {
			notifications.show({
				title: "Error",
				message: "An error occurred while updating unit status"
			});
		}
	});
	useEffect(() => {
		if (defaultValues) {
			setStatus({
				value: defaultValues.status,
				label: defaultValues.status
			});
		}
	}, [defaultValues]);

	const unitStatuses = useMemo(() => {
		return Object.values(UnitStatuses).map((item) => ({
			value: item,
			label: item
		}));
	}, [UnitStatuses]);

	const onStatusChange = async (value: any) => {
		setStatus({
			value: value,
			label: value
		});
		if (id) {
			await updateStatus({ status: value });
		}
	};

	return (
		<div>
			{/*<Controller
				name="buildingId"
				control={control}
				rules={{ required: "This field is required" }}
				render={({ field }) => (
					<AsyncSelect
						entityName="buildingId"
						getEntity={getBuildings}
						valueKey="id"
						labelKey="buildingId"
						onChange={onChange}
						defaultValue={defaultValue}
						isMulti={false}
					/>
				)}
			/>*/}
			{!edit ? (
				<Controller
					name="buildingId"
					control={control}
					rules={{ required: "This field is required" }}
					render={({ field }) => (
						<InputWrapper description="Building" classNames={{ description: styles.label }}>
							<AsyncSelectPaginate
								{...field}
								error={errors?.buildingId?.message as string}
								loadOptions={getBuildings}
								onChange={(value) => field.onChange(value)}
								onBlur={() => field.onBlur()}
								pageSize={10}
								value={field.value}
								getOptionLabel={(building: Building) => building.name}
								getOptionValue={(building: Building) => building.id}
							/>
						</InputWrapper>
					)}
				/>
			) : (
				<Grid>
					<Grid.Col span={3}>
						<Text c="#868E96" fz={14}>
							Building
						</Text>
						<Text fw={600} mb={16} fs={"italic"}>
							{defaultValues?.buildingId?.label}
						</Text>
					</Grid.Col>
					{listingId ? (
						<Grid.Col span={3}>
							<Text c="#868E96" fz={14}>
								Status
							</Text>
							<Text fw={600} mb={16}>
								{defaultValues?.status}
							</Text>
						</Grid.Col>
					) : null}
				</Grid>
			)}

			<Flex display="flex" gap={20}>
				<Controller
					control={control}
					name="feeType"
					render={({ field: { onChange, onBlur, value } }) => (
						<SelectInput
							value={value}
							onChange={onChange}
							width="100%"
							placeholder="Fee type"
							onBlur={onBlur}
							error={errors?.feeType?.message as string}
							data={FeeTypesOptions}
						/>
					)}
				/>
			</Flex>

			<SimpleGrid cols={3}>
				{/*TODO: add validation to status*/}
				{edit && !listingId ? (
					<SelectInput
						value={status?.label || ""}
						onChange={onStatusChange}
						width="100%"
						placeholder="Status"
						onBlur={() => {}}
						data={unitStatuses}
					/>
				) : null}
				<Controller
					control={control}
					name="unitNumber"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							type="text"
							value={value}
							placeholder="Unit number"
							error={errors?.unitNumber?.message as string}
						/>
					)}
				/>

				<Controller
					control={control}
					name="floor"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							type="number"
							value={value}
							placeholder="Floor"
							error={errors?.floor?.message as string}
						/>
					)}
				/>

				<Controller
					control={control}
					name="unitName"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							placeholder="Unit name"
							error={errors?.unitName?.message as string}
						/>
					)}
				/>

				<Controller
					control={control}
					name="unitRent"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							type="number"
							onBlur={onBlur}
							value={value}
							error={errors?.unitRent?.message as string}
							placeholder="Unit rent"
						/>
					)}
				/>

				<Controller
					control={control}
					name="lockboxType"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.lockboxType?.message as string}
							placeholder="Lock box type"
						/>
					)}
				/>

				<Controller
					control={control}
					name="keyArchiveNumber"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.keyArchiveNumber?.message as string}
							placeholder="Key archive number"
						/>
					)}
				/>

				<Controller
					control={control}
					name="lockboxCode"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.lockboxCode?.message as string}
							placeholder="Lock box code"
						/>
					)}
				/>

				<Controller
					control={control}
					name="altUnitNumber"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.altUnitNumber?.message as string}
							placeholder="Alt unit number"
						/>
					)}
				/>

				<Controller
					control={control}
					name="specialPrice"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							type="number"
							value={value}
							error={errors.specialPrice?.message as string}
							placeholder="Special price"
						/>
					)}
				/>

				<Controller
					control={control}
					name="specialPriceNote"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.specialPriceNote?.message as string}
							placeholder="Special price note"
						/>
					)}
				/>

				<Controller
					control={control}
					name="SqrFt"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							type="number"
							onBlur={onBlur}
							value={value}
							error={errors.SqrFt?.message as string}
							placeholder="Sqrt ft"
						/>
					)}
				/>

				<Controller
					control={control}
					name="shiftingFeePrice"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.shiftingFeePrice?.message as string}
							placeholder="Shifting fee price"
						/>
					)}
				/>

				<Controller
					control={control}
					name="feePercentage"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							type="number"
							error={errors.feePercentage?.message as string}
							placeholder="Fee percentage"
						/>
					)}
				/>

				<Controller
					control={control}
					name="availability"
					render={({ field: { onChange, onBlur, value } }) => (
						<DateInput
							value={value ? new Date(value) : null}
							onChange={onChange}
							description="Date input"
							style={{ width: 300 }}
							size="md"
							variant="filled"
							radius="md"
							error={errors.availability?.message as string}
							placeholder="Date input"
						/>
					)}
				/>
			</SimpleGrid>

			<Box>
				<Controller
					control={control}
					name="notes"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							onChange={onChange}
							component="textarea"
							rows={3}
							width="100%"
							onBlur={onBlur}
							value={value}
							error={errors.notes?.message as string}
							placeholder="Notes"
						/>
					)}
				/>
			</Box>

			<SimpleGrid cols={3} my="sm">
				<Controller
					name="haveKey"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Checkbox
							label="key"
							labelPosition="right"
							onChange={onChange}
							onBlur={onBlur}
							checked={value}
							error={errors.haveKey?.message as string}
						/>
					)}
				/>

				<Controller
					name="forSale"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Checkbox
							label="For sale"
							labelPosition="right"
							onChange={onChange}
							onBlur={onBlur}
							checked={value}
							error={errors.forSale?.message as string}
						/>
					)}
				/>

				<Controller
					name="forRent"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Checkbox
							label="For rent"
							labelPosition="right"
							onChange={onChange}
							onBlur={onBlur}
							checked={value}
							error={errors.forRent?.message as string}
						/>
					)}
				/>

				<Controller
					name="useActualSqrFt"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Checkbox
							label="Use actual sqr ft"
							labelPosition="right"
							onChange={onChange}
							onBlur={onBlur}
							checked={value}
							error={errors.useActualSqrFt?.message as string}
						/>
					)}
				/>

				<Controller
					name="hasLockbox"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Checkbox
							label="Has lockbox"
							labelPosition="right"
							onChange={onChange}
							onBlur={onBlur}
							checked={value}
							error={errors.hasLockbox?.message as string}
						/>
					)}
				/>
			</SimpleGrid>
		</div>
	);
};
