import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Box, Collapse, Flex, Grid, Input, InputWrapper, NumberInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

import styles from "./BuildingDistricts.module.scss";

export const BuildingDistricts: FC = () => {
	const [openedDistrictsBox, { toggle: toggleDistrictsBox }] = useDisclosure(true);
	const {
		control,
		formState: { errors }
	} = useFormContext();
	return (
		<Box>
			<Flex justify="space-between">
				<Title className={styles.title} order={5}>
					DISTRICTS
				</Title>
				{openedDistrictsBox ? (
					<IconArrowUp className={styles.pointer} onClick={toggleDistrictsBox} />
				) : (
					<IconArrowDown className={styles.pointer} onClick={toggleDistrictsBox} />
				)}
			</Flex>
			<Collapse in={openedDistrictsBox} transitionDuration={500} transitionTimingFunction="linear">
				<Grid>
					<Grid.Col span={6}>
						<Controller
							name="community_district"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Community District"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										min={0}
										name="community_district"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.community_district?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="school_district"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="School District"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										min={0}
										name="school_district"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.school_district?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="fire_department"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Fire Department"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<Input
										name="fire_department"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.fire_department?.message as string}
									/>
								</InputWrapper>
							)}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Controller
							name="police_precinct"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Policy Precinct"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										min={0}
										name="police_precinct"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.police_precinct?.message as string}
									/>
								</InputWrapper>
							)}
						/>
						<Controller
							name="city_council"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="City Council"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<NumberInput
										min={0}
										name="city_council"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										error={errors.city_council?.message as string}
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
