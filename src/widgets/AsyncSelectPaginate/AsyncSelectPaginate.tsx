import React from "react";
import type { LoadOptions } from "react-select-async-paginate";
import { AsyncPaginate } from "react-select-async-paginate";

import { Text } from "@mantine/core";

interface AsyncSelectPaginateProps<T, V> {
	loadOptions: any;
	onChange: (value: V | null) => void;
	onBlur: () => void;
	value: V | null;
	pageSize: number;
	placeholder?: string;
	error?: string;
	getOptionLabel: (option: T) => string | number;
	getOptionValue: (option: T) => string;
}

export const AsyncSelectPaginate = <T, V>({
	loadOptions,
	onChange,
	onBlur,
	value,
	pageSize,
	getOptionLabel,
	error,
	getOptionValue,
	placeholder,
	...props
}: AsyncSelectPaginateProps<T, V>) => {
	const handleLoadOptions = async (searchQuery: any, loadedOptions: any, { page }: any) => {
		const response = await loadOptions({
			page,
			perPage: pageSize,
			search: searchQuery
		});
		return {
			options: response.list.map((item: T) => ({
				label: getOptionLabel(item),
				value: getOptionValue(item)
			})),
			hasMore: response.meta.page * response.meta.perPage < response.meta.total,
			additional: {
				page: page + 1
			}
		};
	};

	const customStyles = {
		control: (base: any, state: any) => ({
			...base,
			borderColor: state.isFocused ? "#ddd" : !error ? "#ddd" : "red",
			// overwrittes hover style
			"&:hover": {
				borderColor: state.isFocused ? "#ddd" : !error ? "#ddd" : "red"
			}
		})
	};

	return (
		<>
			<AsyncPaginate
				classNamePrefix="react-select"
				loadOptions={handleLoadOptions}
				onChange={onChange}
				placeholder={placeholder}
				styles={customStyles}
				onBlur={onBlur}
				value={value}
				additional={{
					page: 1
				}}
				{...props}
			/>
			<Text c="#e03131">{error}</Text>
		</>
	);
};
