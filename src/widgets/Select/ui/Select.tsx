import { FC, useEffect, useMemo, useState } from "react";
import Select from "react-select";

import { useQuery } from "@tanstack/react-query";

import styles from "./Select.module.scss";

const PER_PAGE = 10;
type Meta = {
	total: number;
};

type AsyncSelectProps<T> = {
	entityName: any;
	getEntity: (params: any) => Promise<{ list: T[]; meta: Meta }>;
	valueKey: keyof T;
	labelKey: Array<keyof T>;
	onChange: (value: any[]) => void;
	defaultValue: T[];
	isMulti: boolean;
	isError?: boolean;
};

export const AsyncSelect = <T extends Record<string, any>>({
	entityName,
	getEntity,
	valueKey,
	labelKey,
	onChange,
	defaultValue,
	isMulti,
	isError
}: AsyncSelectProps<T>) => {
	const [page, setPage] = useState(1);
	const [options, setOptions] = useState<T[]>([]);

	const { data: entityList, isLoading } = useQuery<{ list: T[]; meta: Meta }>({
		queryKey: [entityName, page],
		queryFn: () => getEntity({ page, perPage: PER_PAGE, sortBy: "createdAt", sortOrder: 1 }),
		keepPreviousData: true
	});
	useEffect(() => {
		if (entityList?.list && defaultValue.length) {
			const newData = entityList.list.filter((entity) => {
				return !defaultValue.some((option) => option.value === entity.id);
			});
			if (!newData.length) {
				setPage((p) => p + 1);
			}
		}
	}, [defaultValue, entityList?.list]);

	useEffect(() => {
		if (!entityList) {
			return;
		}

		setOptions((prevOptions) => {
			const newData = entityList.list.filter((entity) => {
				return !prevOptions.some((option) => option.value === entity.id);
			});
			if (newData.length) {
				const converted = newData.map((entity) => {
					const label = labelKey.map((item) => entity[item]).join(" ");
					return {
						value: entity[valueKey],
						label,
						...entity
					};
				});
				return prevOptions.concat(converted);
			}
			return prevOptions;
		});
	}, [entityList]);

	const onMenuScrollToBottom = (event: WheelEvent | TouchEvent) => {
		if (event.isTrusted && fetchNextPage) {
			setPage((p) => p + 1);
		}
	};

	const limit = useMemo(() => {
		return entityList?.meta?.total || PER_PAGE;
	}, [entityList]);

	const fetchNextPage = useMemo(() => {
		return limit > page * PER_PAGE;
	}, [limit, page]);

	return (
		<Select
			isMulti={isMulti}
			options={options}
			isLoading={isLoading}
			closeMenuOnSelect={!isMulti}
			onChange={onChange as any}
			onMenuScrollToBottom={onMenuScrollToBottom}
			value={defaultValue}
			className={styles.options}
			styles={{
				control: (baseStyles, state) => ({
					...baseStyles,
					borderColor: isError ? "red" : "#F1F3F5",
					backgroundColor: "#F1F3F5"
				})
			}}
		/>
	);
};
