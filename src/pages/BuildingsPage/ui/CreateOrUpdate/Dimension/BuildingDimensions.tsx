import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Box, Collapse, Flex, Grid, Input, InputWrapper, NumberInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

import styles from "./BuildingDimensions.module.scss";

export const BuildingDimensions: FC = () => {
	const [openedDimensionsBox, { toggle: toggleDimensionsBox }] = useDisclosure(true);
	const {
		control,
		formState: { errors }
	} = useFormContext();
	return (
		<Box>
			<Flex justify="space-between">
				<Title className={styles.title} order={5}>
					SIZE DIMENSIONS
				</Title>
				{openedDimensionsBox ? (
					<IconArrowUp className={styles.pointer} onClick={toggleDimensionsBox} />
				) : (
					<IconArrowDown className={styles.pointer} onClick={toggleDimensionsBox} />
				)}
			</Flex>
			<Collapse in={openedDimensionsBox} transitionDuration={500} transitionTimingFunction="linear">
				<Grid>
					<Grid.Col span={6}>
						<Controller
							name="units"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Units"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										min={0}
										name="units"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.totalUnits?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="building_Sq_Ft"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Building Sq Ft"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<Input
										name="building_Sq_Ft"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.building_Sq_Ft?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="building_depth"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Building depth"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<Input
										name="building_depth"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.building_depth?.message as string}
									/>
								</InputWrapper>
							)}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Controller
							name="stories"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Stories"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										min={0}
										name="stories"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.stories?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="lot_Sq_Ft"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Lot Sq Ft"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<Input
										name="lot_Sq_Ft"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.lot_Sq_Ft?.message as string}
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
