import React, { FC, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Box, Collapse, Flex, Grid, Input, InputWrapper, Select, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

import { Building, PetPolicyAllowance } from "../../../../../types/building";

import styles from "./BuildingPetPolicy.module.scss";

interface BuildingPetPolicyProps {
	edit?: Building | undefined;
}

export const BuildingPetPolicy: FC<BuildingPetPolicyProps> = ({ edit }) => {
	const [openedPetPolicyBox, { toggle: togglePetPolicyBox }] = useDisclosure<boolean>(true);
	const {
		control,
		formState: { errors }
	} = useFormContext();
	const petPolicy: string[] = useMemo(() => {
		return Object.values(PetPolicyAllowance);
	}, [PetPolicyAllowance]);
	return (
		<Box>
			<Flex justify="space-between">
				<Title className={styles.title} order={5}>
					PET POLICY
				</Title>
				{openedPetPolicyBox ? (
					<IconArrowUp className={styles.pointer} onClick={togglePetPolicyBox} />
				) : (
					<IconArrowDown className={styles.pointer} onClick={togglePetPolicyBox} />
				)}
			</Flex>
			<Collapse in={openedPetPolicyBox} transitionDuration={500} transitionTimingFunction="linear">
				<Grid>
					<Grid.Col span={6}>
						<Controller
							name="dogs"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<Select
									description="Dogs"
									data={petPolicy}
									onChange={onChange}
									onBlur={onBlur}
									value={value}
									error={errors.dogs?.message as string}
									defaultValue={edit?.petsPolicy?.dogs}
									classNames={{
										root: styles.margin_bottom
									}}
								/>
							)}
						/>
						<Controller
							name="smallPets"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<Select
									description="Small pets"
									data={petPolicy}
									onChange={onChange}
									onBlur={onBlur}
									value={value}
									defaultValue={edit?.petsPolicy?.smallPets}
									error={errors.smallPets?.message as string}
									classNames={{
										root: styles.margin_bottom
									}}
								/>
							)}
						/>
						<Controller
							name="petsOnApproval"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<InputWrapper
									description="Pets On Approval"
									classNames={{
										root: styles.margin_bottom
									}}
								>
									<Input
										name="petsOnApproval"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
										defaultValue={edit?.petsPolicy?.petsOnApproval}
										error={errors.petsOnApproval?.message as string}
									/>
								</InputWrapper>
							)}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Controller
							name="cats"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<Select
									description="Cats"
									data={petPolicy}
									onChange={onChange}
									onBlur={onBlur}
									value={value}
									defaultValue={edit?.petsPolicy?.cats}
									error={errors.cats?.message as string}
									classNames={{
										root: styles.margin_bottom
									}}
								/>
							)}
						/>
						<Controller
							name="noPets"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<Select
									description="No pets"
									data={petPolicy}
									onChange={onChange}
									onBlur={onBlur}
									value={value}
									defaultValue={edit?.petsPolicy?.noPets}
									error={errors.noPets?.message as string}
									classNames={{
										root: styles.margin_bottom
									}}
								/>
							)}
						/>
					</Grid.Col>
				</Grid>
			</Collapse>
		</Box>
	);
};
