import { FC, useCallback, useMemo, useState } from "react";
import { Input } from "shared/ui";

import { IconFilter, IconFilterOff, IconSearch } from "@tabler/icons-react";

import styles from "./TableFilter.module.scss";

type ColumnFilter = {
	id: string;
	value: string;
};

interface TableFilterProps {
	columnFilters: ColumnFilter[];
	setColumnFilters: (filters: ColumnFilter[]) => void;
	filters: string[];
	setGlobalFilter: (filter: string) => void;
	globalFilter: string;
}

export const TableFilter: FC<TableFilterProps> = ({
	columnFilters,
	setColumnFilters,
	filters,
	setGlobalFilter,
	globalFilter
}) => {
	const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>("");

	const searchValue = useMemo(() => {
		return columnFilters.find((f) => f.id === filter)?.value || globalFilter;
	}, [columnFilters, globalFilter]);

	const onFilterChange = useCallback(
		(value: string) => {
			if (value && !filter) {
				setGlobalFilter(value);
				return;
			}
			if (!value) {
				setGlobalFilter("");
				setColumnFilters([]);
				return;
			}
			if (value && filter) {
				setGlobalFilter("");
				setColumnFilters([{ id: filter, value }]);
			}
		},
		[filter]
	);

	const onFilterClick = useCallback(
		(value: string) => {
			setFilter(value);
			setIsFiltersOpen((v) => !v);
			if (searchValue) {
				setGlobalFilter("");
				setColumnFilters([{ id: value, value: searchValue }]);
			}
		},
		[searchValue]
	);

	const resetFilter = useCallback(() => {
		if (searchValue) {
			setColumnFilters([]);
			setGlobalFilter(searchValue);
		}
		setFilter("");
	}, [searchValue]);

	return (
		<div className={styles.filter_container}>
			<Input
				size="xs"
				radius="sm"
				icon={<IconSearch size={16} />}
				onChange={(e) => onFilterChange(e.target.value)}
			/>
			<div className={styles.filter_box}>
				{filter ? <IconFilterOff onClick={resetFilter} size={16} /> : <IconFilter size={16} />}
				<span onClick={() => setIsFiltersOpen((v) => !v)}>{filter || "FILTER"}</span>
				{isFiltersOpen && (
					<ul className={styles.filter_list}>
						{filters.map((item) => (
							<li onClick={() => onFilterClick(item)} className={styles.filter_list_item} key={item}>
								{item}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};
