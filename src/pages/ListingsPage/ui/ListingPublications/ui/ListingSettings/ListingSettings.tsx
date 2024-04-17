import _ from "lodash";
import React, { FC, useMemo } from "react";
import { getAmenityById, getUtilityById } from "shared/api/settings";
import usePublicationStore from "shared/stores/publications/usePublicationStore";

import { Accordion, AccordionItem, AccordionPanel, Divider, Table, Title } from "@mantine/core";
import { useQueries } from "@tanstack/react-query";

export const ListingSettings: FC = () => {
	const { buildings, units } = usePublicationStore();
	const buildingAmenityIds = useMemo(() => {
		const result: any[] = [];
		if (buildings.length) {
			buildings.forEach((b) => {
				if (b.amenities.length) {
					result.push(...b.amenities);
				}
			});
		}
		return result;
	}, [buildings]);

	const unitAmenityIds = useMemo(() => {
		const result: any[] = [];
		if (units.length) {
			units.forEach((b) => {
				if (b.amenities.length) {
					result.push(...b.amenities);
				}
			});
		}
		return result;
	}, [units]);

	const utilityIds = useMemo(() => {
		const result: any[] = [];
		if (buildings.length) {
			buildings.forEach((b) => {
				if (b.utilities.length) {
					result.push(...b.utilities);
				}
			});
		}
		return result;
	}, [buildings]);

	const amenities = useQueries({
		queries:
			buildingAmenityIds?.map((item) => ({
				queryKey: ["amenities", item],
				queryFn: async () => await getAmenityById(item),
				enabled: !!item,
				staleTime: Infinity
			})) ?? []
	});

	const unitAmenities = useQueries({
		queries:
			unitAmenityIds?.map((item) => ({
				queryKey: ["amenities", item],
				queryFn: async () => await getAmenityById(item),
				enabled: !!item,
				staleTime: Infinity
			})) ?? []
	});

	const utilities = useQueries({
		queries:
			utilityIds?.map((item) => ({
				queryKey: ["utilities", item],
				queryFn: async () => await getUtilityById(item),
				enabled: !!item,
				staleTime: Infinity
			})) ?? []
	});
	return (
		<>
			<Accordion variant="contained" defaultValue="data">
				<AccordionItem value="data">
					<Accordion.Control>
						<Title order={5}>Building Amenities</Title>
					</Accordion.Control>
					<AccordionPanel>
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Tbody>
								{amenities.length
									? amenities.map((am) => (
											<Table.Tr key={_.uniqueId("building_")}>
												<Table.Td>{am?.data?.name}</Table.Td>
												<Table.Td>{am?.data?.category}</Table.Td>
												<Table.Td>{am?.data?.icon}</Table.Td>
											</Table.Tr>
										))
									: null}
							</Table.Tbody>
						</Table>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
			<Divider my={25} />
			<Accordion variant="contained" defaultValue="data">
				<AccordionItem value="data">
					<Accordion.Control>
						<Title order={5}>Unit Amenities</Title>
					</Accordion.Control>
					<AccordionPanel>
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Tbody>
								{unitAmenities.length
									? unitAmenities.map((am) => (
											<Table.Tr key={_.uniqueId("unit_")}>
												<Table.Td>{am?.data?.name}</Table.Td>
												<Table.Td>{am?.data?.category}</Table.Td>
												<Table.Td>{am?.data?.icon}</Table.Td>
											</Table.Tr>
										))
									: null}
							</Table.Tbody>
						</Table>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
			<Divider my={25} />
			<Accordion variant="contained" defaultValue="data">
				<AccordionItem value="data">
					<Accordion.Control>
						<Title order={5}>Utilities</Title>
					</Accordion.Control>
					<AccordionPanel>
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Tbody>
								{utilities.length
									? utilities.map((am) => (
											<Table.Tr key={_.uniqueId("utility_")}>
												<Table.Td>{am?.data?.name}</Table.Td>
												<Table.Td>{am?.data?.notes}</Table.Td>
												<Table.Td>{am?.data?.icon}</Table.Td>
											</Table.Tr>
										))
									: null}
							</Table.Tbody>
						</Table>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</>
	);
};
