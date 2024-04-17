import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { RoomStatusesOptions } from "shared/constants/rooms/room-constants-options.ts";
import {
	FeeTypesOptions,
	RoomTypesOptions
} from "shared/constants/rooms/room-constants-options.ts";
import { Input, SelectInput } from "shared/ui";

import {
	Box,
	Button,
	Divider,
	Flex,
	Grid,
	List,
	Modal,
	rem,
	Text,
	Textarea,
	ThemeIcon
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconNote, IconTrashXFilled } from "@tabler/icons-react";

import { BuildingAmenities } from "../../../../../BuildingsPage/ui/CreateOrUpdate/Amenities/BuildingAmenities";
import { BuildingContacts } from "../../../../../BuildingsPage/ui/CreateOrUpdate/Contacts/BuildingContacts";
import { CreateAmenityOrUpdate } from "../../../../../SettingsPage/ui/AmenitiesPage/ui/CreateOrUpdate/CreateAmenityOrUpdate";
import { CreateContactOrUpdate } from "../../../../../SettingsPage/ui/ContactsPage/ui/CreateOrUpdate/CreateContactOrUpdate";

import styles from "../../../../../BuildingsPage/ui/CreateOrUpdate/Info/BuildingInfo.module.scss";

export const CreateOrUpdateRoomForm = () => {
	const {
		control,
		setValue,
		formState: { errors, defaultValues }
	} = useFormContext();
	const [openedContact, { open: openContact, close: closeContact }] = useDisclosure(false);
	const [openedAmenity, { open: openAmenity, close: closeAmenity }] = useDisclosure(false);
	const [notes, setNotes] = useState<{ id: string; value: string }[]>([]);
	const [note, setNote] = useState<string>("");

	useEffect(() => {
		const result = notes.map((n) => n.value);
		setValue("notes", result);
	}, [notes.length]);

	useEffect(() => {
		if (defaultValues?.notes) {
			const result = defaultValues.notes.map((n: { id: string; value: string }) => ({
				id: _.uniqueId("note_"),
				value: n
			}));
			setNotes(result);
		}
	}, [defaultValues]);

	const addNote = useCallback(() => {
		setNotes((prev) => {
			prev.push({
				id: _.uniqueId("note_"),
				value: note
			});
			return prev;
		});
		setNote("");
	}, [note]);

	const removeNote = useCallback(
		(id: string) => {
			const result = notes.filter((item) => item.id !== id);
			setNotes(result);
		},
		[notes]
	);

	const handleNote = (value: any) => setNote(value);

	return (
		<Grid>
			<Grid.Col span={12}>
				<Grid>
					<Grid.Col span={6}>
						<Controller
							control={control}
							name="roomType"
							render={({ field: { onChange, onBlur, value } }) => (
								<SelectInput
									value={value}
									onChange={onChange}
									width="100%"
									placeholder="Room Type"
									onBlur={onBlur}
									data={RoomTypesOptions}
									error={errors.roomType?.message as string}
								/>
							)}
						/>
						<Controller
							control={control}
							name="roomNumber"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									onChange={onChange}
									onBlur={onBlur}
									type="number"
									value={value}
									width="100%"
									error={errors.roomNumber?.message as string}
									placeholder="Room number"
								/>
							)}
						/>
						<Controller
							control={control}
							name="unitRent"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									onChange={onChange}
									onBlur={onBlur}
									type="number"
									value={value}
									width="100%"
									error={errors.unitRent?.message as string}
									placeholder="Unit rent"
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
									width="100%"
									value={value}
									error={errors.specialPrice?.message as string}
									placeholder="Special Price"
								/>
							)}
						/>
						<Controller
							control={control}
							name="feeType"
							render={({ field: { onChange, onBlur, value } }) => (
								<SelectInput
									value={value}
									onChange={onChange}
									width="100%"
									placeholder="Fee Type"
									onBlur={onBlur}
									data={FeeTypesOptions}
								/>
							)}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Controller
							control={control}
							name="status"
							render={({ field: { onChange, onBlur, value } }) => (
								<SelectInput
									value={value}
									onChange={onChange}
									width="100%"
									placeholder="Status"
									onBlur={onBlur}
									data={RoomStatusesOptions}
								/>
							)}
						/>

						<Controller
							control={control}
							name="sqrFt"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									onChange={onChange}
									onBlur={onBlur}
									type="number"
									width="100%"
									value={value}
									error={errors.sqrFt?.message as string}
									placeholder="Sqrt Ft"
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
									type="text"
									width="100%"
									value={value}
									error={errors.shiftingFeePrice?.message as string}
									placeholder="Shifting Fee Price"
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
									type="text"
									width="100%"
									value={value}
									error={errors.specialPriceNote?.message as string}
									placeholder="Shifting Price Note"
								/>
							)}
						/>
						<Controller
							control={control}
							name="feePercent"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									onChange={onChange}
									onBlur={onBlur}
									type="number"
									width="100%"
									value={value}
									error={errors.feePercent?.message as string}
									placeholder="Fee Percent"
								/>
							)}
						/>
					</Grid.Col>
				</Grid>
			</Grid.Col>
			<Grid.Col span={12}>
				<Controller
					control={control}
					name="availability"
					render={({ field: { onChange, onBlur, value } }) => (
						<DateInput
							onChange={onChange}
							value={value ? new Date(value) : null}
							placeholder="Availability"
							onBlur={onBlur}
							description="Availability"
							variant="filled"
							error={errors?.availability?.message as string}
						/>
					)}
				/>
			</Grid.Col>
			<Grid.Col span={12}>
				<Textarea
					variant="filled"
					description="Note"
					placeholder="Note"
					mb={16}
					onChange={(e) => handleNote(e.target.value)}
					value={note}
				/>
				<Flex justify="flex-end">
					<Button onClick={() => addNote()}>Add</Button>
				</Flex>
				{notes.length ? (
					<List
						icon={
							<ThemeIcon color="teal" size={20} radius="xl">
								<IconNote style={{ width: rem(14), height: rem(14) }} />
							</ThemeIcon>
						}
					>
						{notes.map((note, i) => {
							return (
								<List.Item
									key={note.id}
									classNames={{
										itemLabel: styles.info_item,
										itemWrapper: styles.info_item,
										item: styles.margin_bottom
									}}
								>
									<Flex justify="space-between" align="center" gap={20}>
										<Text>{note.value}</Text>
										<Box>
											<IconTrashXFilled
												style={{ width: rem(16), height: rem(16), color: "red" }}
												onClick={() => removeNote(note.id)}
											/>
										</Box>
									</Flex>
								</List.Item>
							);
						})}
					</List>
				) : null}
				<Divider mt={16} mb={16} />
			</Grid.Col>
			<Grid.Col span={12}>
				<BuildingContacts open={openContact} />
				<Divider mt={16} mb={16} />
				<BuildingAmenities open={openAmenity} />

				<Modal opened={openedAmenity} onClose={closeAmenity} title="Create Amenity" centered my={10}>
					<CreateAmenityOrUpdate onClose={closeAmenity} />
				</Modal>

				<Modal opened={openedContact} onClose={closeContact} title="Create Contact" centered>
					<CreateContactOrUpdate onClose={closeContact} />
				</Modal>
			</Grid.Col>
		</Grid>
	);
};
