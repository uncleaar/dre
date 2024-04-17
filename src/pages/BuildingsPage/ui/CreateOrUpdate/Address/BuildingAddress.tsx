import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { USStates } from "shared/constants/us-states";

import {
	Box,
	Collapse,
	Flex,
	Grid,
	Input,
	InputWrapper,
	NumberInput,
	Select,
	Textarea,
	Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

import styles from "./BuildingAddress.module.scss";

export const BuildingAddress: FC = () => {
	const [openedAddressBox, { toggle: toggleAddressBox }] = useDisclosure(true);
	const {
		control,
		formState: { errors }
	} = useFormContext();
	return (
		<Box>
			<Flex justify="space-between">
				<Title className={styles.title} order={5}>
					ADDRESS
				</Title>
				{openedAddressBox ? (
					<IconArrowUp className={styles.pointer} onClick={toggleAddressBox} />
				) : (
					<IconArrowDown className={styles.pointer} onClick={toggleAddressBox} />
				)}
			</Flex>
			<Collapse in={openedAddressBox} transitionDuration={500} transitionTimingFunction="linear">
				<Grid>
					<Grid.Col span={6}>
						<Controller
							name="address"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Address"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.address?.message as string}
								>
									<Input
										name="address"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.address?.message as string}
									/>
								</InputWrapper>
							)}
						/>

						<Controller
							name="city"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="City"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.city?.message as string}
								>
									<Input
										name="city"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.city?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="state"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="State"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.state?.message as string}
								>
									<Select data={Object.values(USStates)} onChange={onChange} onBlur={onBlur} value={value} />
								</InputWrapper>
							)}
						/>
						<Controller
							name="borough"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Borough"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.borough?.message as string}
								>
									<Input
										name="borough"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.borough?.message as string}
									/>
								</InputWrapper>
							)}
						/>

						<Controller
							name="longitude"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Longitude"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										name="longitude"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.longitude?.message as string}
									/>
								</InputWrapper>
							)}
						/>

						<Controller
							name="advertisingLongitude"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Advertising Address Longitude"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										name="advertisingLongitude"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.advertisingLongitude?.message as string}
									/>
								</InputWrapper>
							)}
						/>

						<Controller
							name="meetingPlace"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Meeting Place"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.meetingPlace?.message as string}
								>
									<Input
										name="meetingPlace"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.meetingPlace?.message as string}
									/>
								</InputWrapper>
							)}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Controller
							name="advertisingAddress"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Advertising Address"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.advertisingAddress?.message as string}
								>
									<Input
										name="advertisingAddress"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.advertisingAddress?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="zip"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Zip"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.zip?.message as string}
								>
									<Input
										name="zip"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.zip?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="country"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Country"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.country?.message as string}
								>
									<Input
										name="country"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.country?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="neighborhood"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Neighborhood"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.neighborhood?.message as string}
								>
									<Input
										name="neighborhood"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.neighborhood?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="latitude"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Latitude"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										name="latitude"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.latitude?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="advertisingLatitude"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Advertising Address Latitude"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										name="advertisingLatitude"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.advertisingLatitude?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="crossStreet"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Cross Street"
									classNames={{
										root: styles.margin_bottom
									}}
									error={errors.crossStreet?.message as string}
								>
									<Input
										name="crossStreet"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.crossStreet?.message as string}
									/>
								</InputWrapper>
							)}
						/>
					</Grid.Col>
				</Grid>
				<Controller
					name="note"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Textarea
							description="Note"
							className={styles.margin_bottom}
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.note?.message as string}
						/>
					)}
				/>
			</Collapse>
		</Box>
	);
};
