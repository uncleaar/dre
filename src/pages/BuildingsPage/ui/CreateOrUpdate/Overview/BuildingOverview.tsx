import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Box, Collapse, Flex, Grid, Input, InputWrapper, NumberInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

import styles from "./BuildingOverview.module.scss";

export const BuildingOverview: FC = () => {
	const [openedOverviewBox, { toggle: toggleOverviewBox }] = useDisclosure(true);
	const {
		control,
		formState: { errors }
	} = useFormContext();
	return (
		<Box>
			<Flex justify="space-between">
				<Title className={styles.title} order={5}>
					BUILDING OVERVIEW
				</Title>
				{openedOverviewBox ? (
					<IconArrowUp className={styles.pointer} onClick={toggleOverviewBox} />
				) : (
					<IconArrowDown className={styles.pointer} onClick={toggleOverviewBox} />
				)}
			</Flex>
			<Collapse in={openedOverviewBox} transitionDuration={500} transitionTimingFunction="linear">
				<Grid>
					<Grid.Col span={6}>
						<Controller
							name="property_type"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Property Type"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<Input
										name="property_type"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.property_type?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="owner"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Owner"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<Input
										name="owner"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.owner?.message as string}
									/>
								</InputWrapper>
							)}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Controller
							name="year_built"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Year Built"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										min={1900}
										max={new Date().getUTCFullYear()}
										name="year_built"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.year_built?.message as string}
									/>
								</InputWrapper>
							)}
						/>
					</Grid.Col>
				</Grid>
			</Collapse>
		</Box>
	);
};
