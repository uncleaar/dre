import React, { FC } from "react";
import { Amenities } from "widgets/Amenities";

import { Box, Divider, Flex, Grid, List, Text, Title } from "@mantine/core";

import { Utilities } from "../../../../../widgets/Utilities";
import { VIEW_COLUMNS } from "../../view-columns";

import styles from "../BuildingView.module.scss";

export const BuildingFacts: FC<any> = ({ buildingData }) => {
	return (
		<Box className={styles.box}>
			<Grid>
				<Grid.Col span={6}>
					<Box className={styles.box}>
						<Box>
							<Title order={6}>Building Overview</Title>
							<List>
								{VIEW_COLUMNS.overview.map((item, i) => {
									return (
										<List.Item
											key={i}
											classNames={{
												itemLabel: styles.item_wrapper,
												itemWrapper: styles.item_wrapper
											}}
										>
											<Flex justify="space-between">
												<Text size="sm" fw={600}>
													{item.title}:
												</Text>
												<Text>{buildingData[item.property] || "-"}</Text>
											</Flex>
										</List.Item>
									);
								})}
							</List>
							<Divider my="sm" />
						</Box>
						<Box>
							<Title order={6}>Districts</Title>
							<List>
								{VIEW_COLUMNS.districts.map((item, i) => {
									return (
										<List.Item
											key={i}
											classNames={{
												itemLabel: styles.item_wrapper,
												itemWrapper: styles.item_wrapper
											}}
										>
											<Flex justify="space-between">
												<Text size="sm" fw={600}>
													{item.title}:
												</Text>
												<Text>{buildingData[item.property] || "-"}</Text>
											</Flex>
										</List.Item>
									);
								})}
							</List>
							<Divider my="sm" />
						</Box>
						<Box>
							<Title order={6}>Districts</Title>
							<List>
								{VIEW_COLUMNS.dimensions.map((item, i) => {
									return (
										<List.Item
											key={i}
											classNames={{
												itemLabel: styles.item_wrapper,
												itemWrapper: styles.item_wrapper
											}}
										>
											<Flex justify="space-between">
												<Text size="sm" fw={600}>
													{item.title}:
												</Text>
												<Text>{buildingData[item.property] || "-"}</Text>
											</Flex>
										</List.Item>
									);
								})}
							</List>
						</Box>
						<Divider my="sm" />
						<Box>
							<Title order={6}>Pets Policy</Title>
							<List>
								{VIEW_COLUMNS.petPolicy.map((item, i) => {
									return (
										<List.Item
											key={i}
											classNames={{
												itemLabel: styles.item_wrapper,
												itemWrapper: styles.item_wrapper
											}}
										>
											<Flex justify="space-between">
												<Text size="sm" fw={600}>
													{item.title}:
												</Text>
												<Text>{buildingData[item.property] || "-"}</Text>
											</Flex>
										</List.Item>
									);
								})}
							</List>
						</Box>
					</Box>
				</Grid.Col>
				<Grid.Col span={6}>
					<Box className={styles.box}>
						<Title order={6}>Info</Title>
						<List>
							{VIEW_COLUMNS.info.map((item, i) => {
								return (
									<List.Item
										key={i}
										classNames={{
											itemLabel: styles.item_wrapper,
											itemWrapper: styles.item_wrapper
										}}
									>
										<Flex justify="space-between" direction="row">
											<Text size="sm" fw={600}>
												{item.title}:
											</Text>
											<Text>{buildingData[item.property] || "-"}</Text>
										</Flex>
									</List.Item>
								);
							})}
						</List>
					</Box>
					<Box className={styles.box}>
						<Title order={6}>Amenities</Title>
						<Amenities amenities={buildingData.amenities} />
					</Box>
					<Box className={styles.box}>
						<Title order={6}>Utilities</Title>
						<Utilities utilities={buildingData.utilities} />
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
};
