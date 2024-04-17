import { useCallback, useMemo, useState } from "react";
import { fuzzyFilter } from "shared/utils/fuzzyFilter";
// import { ColumnFilter } from "widgets/ColumnFilter";
import { Search } from "widgets/Search";

import { Button, Flex, Loader, Pagination, Table } from "@mantine/core";
import type { ColumnDef, OnChangeFn, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";

import styles from "./Table.module.scss";

export interface TableProps<TData> {
	data: any;
	columns: ColumnDef<any>[];
	isLoading?: boolean;
	sorting?: SortingState;
	setSorting?: OnChangeFn<SortingState>;
	handleDelete?: (id: string) => void;
	open?: () => void;
	pageIndex: number;
	pageSize: number;
	totalPages?: number | undefined;
	setPageIndex?: (pageIndex: number) => void;
	setSearchQuery?: (searchQuery: string) => void;
	isLoadingButton?: boolean;
	buttonName?: string;
	setFilter?: (value: string[]) => void;
	filter?: {
		title: string;
		data: string[];
	};
}

export const DataTable = <TData extends object>({
	data,
	columns,
	isLoading,
	sorting,
	setSorting,
	open,
	pageIndex,
	pageSize = 10,
	totalPages,
	setPageIndex,
	setSearchQuery,
	isLoadingButton,
	buttonName = "Create",
	setFilter,
	filter
}: TableProps<TData>) => {
	const memoizedData = useMemo(() => data, [data]);
	const memoizedColumns = useMemo(() => columns, [columns]);

	const table = useReactTable({
		data: memoizedData,
		columns: memoizedColumns,
		filterFns: {
			fuzzy: fuzzyFilter
		},
		state: {
			sorting
		},
		sortDescFirst: false,
		manualSorting: true,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		globalFilterFn: fuzzyFilter,
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedMinMaxValues: getFacetedMinMaxValues()
	});

	const isNoDataFound = !isLoading && (!memoizedData || memoizedData.length === 0);

	const handlePageChange = useCallback(
		(newPageIndex: number) => {
			if (setPageIndex) {
				setPageIndex(newPageIndex);
			}
		},
		[setPageIndex]
	);

	const handleSearchChange = (newSearchQuery: string) => {
		setSearchQuery?.(newSearchQuery);
	};
	const handleFilterChange = (newFilterQuery: string[]) => {
		setFilter?.(newFilterQuery);
	};

	return (
		<div>
			<Button onClick={open} my={10} loading={isLoadingButton}>
				{buttonName}
			</Button>

			<Search
				onFilterChange={handleFilterChange}
				onSearchChange={handleSearchChange}
				filter={filter}
			/>

			<div>
				{!isNoDataFound && isLoading ? (
					<Loader />
				) : (
					<Table withColumnBorders withTableBorder withRowBorders striped highlightOnHover>
						<Table.Thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<Table.Tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<Table.Th key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder ? null : (
												<div
													{...{
														className: header.column.getCanSort() ? styles.column : "",
														onClick: header.column.getToggleSortingHandler()
													}}
												>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{{
														asc: " 🔼",
														desc: " 🔽"
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											)}
											{/*
											//TODO: check functionality, for now just commented
											*/}
											{/*{header.column.getCanFilter() ? (*/}
											{/*	<div>*/}
											{/*		<ColumnFilter column={header.column} table={table} />*/}
											{/*	</div>*/}
											{/*) : null}*/}
										</Table.Th>
									))}
								</Table.Tr>
							))}
						</Table.Thead>
						<Table.Tbody>
							{table.getRowModel().rows.map((row) => (
								<Table.Tr key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<Table.Td key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</Table.Td>
									))}
								</Table.Tr>
							))}
						</Table.Tbody>
						<Table.Tfoot>
							<Table.Tr>
								<Table.Td
									colSpan={columns[0]?.columns.length || 1}
									style={{ borderTop: "1px solid #E9ECEF" }}
								>
									<Flex justify="center">
										{totalPages && totalPages > 1 ? (
											<Pagination
												className={styles.pagination}
												onChange={(page) => handlePageChange(page)}
												total={Math.ceil(totalPages / pageSize)}
												color="teal"
												value={pageIndex}
												size="md"
												withEdges
											/>
										) : (
											<Pagination total={1} color="teal" size="md" disabled className={styles.pagination} />
										)}
									</Flex>
								</Table.Td>
							</Table.Tr>
						</Table.Tfoot>
					</Table>
				)}
			</div>
		</div>
	);
};
