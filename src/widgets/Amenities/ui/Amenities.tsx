import { FC } from "react";

import { Table } from "@mantine/core";

import { Amenity } from "../../../types/amenities";

interface AmenitiesProps {
	amenities: Amenity[];
}

export const Amenities: FC<AmenitiesProps> = ({ amenities = [] }) => {
	const rows = amenities.map((am, i) => (
		<Table.Tr key={am.name}>
			<Table.Td>{i + 1}</Table.Td>
			<Table.Td>{am.name || "-"}</Table.Td>
			<Table.Td>{am.category || "-"}</Table.Td>
			<Table.Td>{am.icon || "-"}</Table.Td>
		</Table.Tr>
	));
	return (
		<>
			{!amenities.length ? (
				<p>There are no amenities added yet</p>
			) : (
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>N</Table.Th>
							<Table.Th>Name</Table.Th>
							<Table.Th>Category</Table.Th>
							<Table.Th>Icon</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
			)}
		</>
	);
};
