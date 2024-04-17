import { FC } from "react";

import { Table } from "@mantine/core";

import { Utility } from "../../../types/utilities";

interface UtilitiesProps {
	utilities: Utility[];
}

export const Utilities: FC<UtilitiesProps> = ({ utilities }) => {
	const rows = utilities.map((ut, i) => (
		<Table.Tr key={ut.name}>
			<Table.Td>{i + 1}</Table.Td>
			<Table.Td>{ut.name || "-"}</Table.Td>
			<Table.Td>{ut.icon || "-"}</Table.Td>
			<Table.Td>{ut.notes || "-"}</Table.Td>
		</Table.Tr>
	));
	return (
		<>
			{!utilities.length ? (
				<p>There are no utilities added yet</p>
			) : (
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>N</Table.Th>
							<Table.Th>Name</Table.Th>
							<Table.Th>Icon</Table.Th>
							<Table.Th>Notes</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
			)}
		</>
	);
};
