import React, { FC } from "react";

import { Table } from "@mantine/core";

import { HighlightCategory } from "../../../types/listing-publications-list";

interface TableContentProps {
	rows: HighlightCategory[];
}

export const TableContent: FC<TableContentProps> = ({ rows }) => {
	const elements = rows.map((element: HighlightCategory) => (
		<Table.Tr key={element.categoryName}>
			<Table.Td>{element.categoryName}</Table.Td>
			<Table.Td>
				{element.highlights.map((high, index) => (
					<Table.Td key={index}>{high}</Table.Td>
				))}
			</Table.Td>
		</Table.Tr>
	));

	return (
		<Table withColumnBorders withTableBorder withRowBorders striped highlightOnHover>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Category</Table.Th>
					<Table.Th>Highlights</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>{elements}</Table.Tbody>
		</Table>
	);
};
