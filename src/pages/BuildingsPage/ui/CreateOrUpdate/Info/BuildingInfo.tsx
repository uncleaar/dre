import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { getBuildingDictionaries } from "shared/api/buildings";

import {
	Box,
	Button,
	Checkbox,
	Collapse,
	Flex,
	Input,
	InputWrapper,
	List,
	Select,
	Text,
	Textarea,
	Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp, IconFileText } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { Building, BuildingStatuses } from "../../../../../types/building";

import styles from "./BuildingInfo.module.scss";

interface BuildingInfoProps {
	edit?: Building | undefined;
}

export const BuildingInfo: FC<BuildingInfoProps> = ({ edit }) => {
	const [openedInfoBox, { toggle: toggleInfoBox }] = useDisclosure(true);
	const [feedbacks, setFeedbacks] = useState<{ id: string; value: string }[]>([]);
	const [feedback, setFeedback] = useState<string>("");
	const {
		control,
		setValue,
		formState: { errors }
	} = useFormContext();

	const { data } = useQuery({
		queryKey: [],
		queryFn: async () => getBuildingDictionaries(),
		keepPreviousData: true
	});

	useEffect(() => {
		if (edit?.feedbacks) {
			const result = edit?.feedbacks.map((item) => ({
				id: `${Math.floor(Math.random() * 100000)}`,
				value: item
			}));
			setFeedbacks(result);
		}
	}, [edit]);

	const occupancyStatus = useMemo(() => {
		return Object.values(BuildingStatuses);
	}, [BuildingStatuses]);

	const handleFeedbackChange = (value: string) => {
		setFeedback(value);
	};
	const addFeedback = () => {
		if (!feedback) return;
		const result = feedbacks.concat({
			id: `${Math.floor(Math.random() * 100000)}`,
			value: feedback
		});
		setFeedbacks(result);
		setFeedback("");
	};
	useEffect(() => {
		const converted = feedbacks.map((f) => f.value);
		setValue("feedbacks", converted);
	}, [feedbacks]);

	const deleteFeedback = useCallback(
		(id: string) => {
			const filtered = feedbacks.filter((item) => item.id !== id);
			setFeedbacks(filtered);
		},
		[feedbacks]
	);
	const buildingTypes: string[] = useMemo(() => {
		if (data) {
			return Object.values(data?.buildingTypes);
		}
		return [];
	}, [data]);

	return (
		<Box>
			<Flex justify="space-between">
				<Title className={styles.title} order={5}>
					INFO
				</Title>
				{openedInfoBox ? (
					<IconArrowUp className={styles.pointer} onClick={toggleInfoBox} />
				) : (
					<IconArrowDown className={styles.pointer} onClick={toggleInfoBox} />
				)}
			</Flex>
			<Collapse in={openedInfoBox} transitionDuration={500} transitionTimingFunction="linear">
				<Flex
					justify="space-between"
					classNames={{
						root: styles.margin_bottom
					}}
				>
					<Controller
						name="name"
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<InputWrapper
								description="Name"
								classNames={{
									root: styles.info_input_wrapper_root
								}}
								error={errors.name?.message as string}
							>
								<Input
									onChange={onChange}
									onBlur={onBlur}
									value={value}
									error={errors.name?.message as string}
								/>
							</InputWrapper>
						)}
					/>
					<Controller
						name="buildingType"
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<InputWrapper
								description="Building Type"
								classNames={{
									root: styles.info_input_wrapper_root,
									description: styles.description
								}}
							>
								<Select
									data={buildingTypes}
									onChange={onChange}
									onBlur={onBlur}
									value={value}
									error={errors.buildingType?.message as string}
								/>
							</InputWrapper>
						)}
					/>
				</Flex>
				<Controller
					name="description"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Textarea
							description="Building Description"
							classNames={{
								root: styles.margin_bottom
							}}
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.description?.message as string}
						/>
					)}
				/>
				<Controller
					name="activate"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Checkbox
							label="Activate"
							labelPosition="right"
							classNames={{
								root: styles.margin_bottom
							}}
							onChange={onChange}
							onBlur={onBlur}
							checked={value}
							error={errors.activate?.message as string}
						/>
					)}
				/>
				<Controller
					name="occupancyStatus"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Select
							classNames={{ root: styles.margin_bottom }}
							data={occupancyStatus}
							description="Occupancy Status"
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.occupancyStatus?.message as string}
						/>
					)}
				/>
				<Flex direction="column">
					<Box className={styles.margin_bottom}>
						<Textarea
							description="Feedback"
							name="feedback"
							onChange={(e) => handleFeedbackChange(e.target.value)}
							classNames={{ root: styles.margin_bottom }}
							value={feedback}
							error={errors.feedbacks?.message as string}
						/>
						<Button
							color="teal"
							disabled={!feedback}
							onClick={() => addFeedback()}
							classNames={{ root: styles.btn_right }}
						>
							Add Feedback
						</Button>
					</Box>
					<Box>
						<List icon={<IconFileText />}>
							{feedbacks.map(({ id, value }) => {
								return (
									<List.Item
										key={id}
										classNames={{
											itemLabel: styles.info_item,
											itemWrapper: styles.info_item,
											item: styles.margin_bottom
										}}
									>
										<Flex justify="space-between" align="center">
											<Text>{value}</Text>
											<Button color="red" size="xs" variant="outline" onClick={() => deleteFeedback(id)}>
												Delete
											</Button>
										</Flex>
									</List.Item>
								);
							})}
						</List>
					</Box>
				</Flex>
			</Collapse>
		</Box>
	);
};
