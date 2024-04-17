import { useMemo, useState } from "react";
import { DebouncedInput } from "shared/ui";

import { Column, Table } from "@tanstack/react-table";

export const ColumnFilter = ({
	column,
	table
}: {
	column: Column<any, unknown>;
	table: Table<any>;
}) => {
	const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
	const minMax = column.getFacetedMinMaxValues()?.map(Number) || [0, 100];
	const [sliderValue, setSliderValue] = useState<[number, number]>();

	const columnFilterValue = column.getFilterValue();

	/*useEffect(() => {
		if (columnFilterValue && Array.isArray(columnFilterValue)) {
			const numericValues = columnFilterValue.map(Number) as [number, number];
			setSliderValue(numericValues);
		}
	}, [columnFilterValue]);*/
	const handleSliderChange = (value: [number, number]) => {
		setSliderValue(value);
		column.setFilterValue(value);
	};

	const sortedUniqueValues = useMemo(
		() =>
			typeof firstValue === "number" ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort(),
		[column.getFacetedUniqueValues()]
	);

	return typeof firstValue === "number" ? (
		<div>
			<div>
				{/*<DebouncedRangeSlider
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
					value={columnFilterValue}
					debounce={1000}
					onChange={handleSliderChange}
				/>*/}
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
					value={(columnFilterValue as [number, number])?.[0] ?? ""}
					onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
					placeholder={`Min ${
						column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ""
					}`}
				/>
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
					value={(columnFilterValue as [number, number])?.[1] ?? ""}
					onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
					placeholder={`Max ${
						column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ""
					}`}
				/>
			</div>
			<div />
		</div>
	) : (
		<div>
			<datalist id={column.id + "list"}>
				{sortedUniqueValues.slice(0, 5000).map((value: string) => (
					<option value={value} key={value} />
				))}
			</datalist>
			<DebouncedInput
				type="text"
				value={(columnFilterValue ?? "") as string}
				onChange={(value) => column.setFilterValue(value)}
				placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
				list={column.id + "list"}
			/>
		</div>
	);
};
