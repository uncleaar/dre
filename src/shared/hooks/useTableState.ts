import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { OnChangeFn, SortingState } from "@tanstack/react-table";

interface TableStateOptions {
	defaultPageSize?: number;
}

interface TableState {
	pageIndex: number;
	setPageIndex: (pageIndex: number) => void;
	pageSize: number;
	sorting: SortingState;
	setSorting: OnChangeFn<SortingState>;
	setPageSize: (pageSize: number) => void;
	searchQuery?: string;
	setSearchQuery?: (searchQuery: string) => void;
}

export const useTableState = ({ defaultPageSize = 10 }: TableStateOptions = {}): TableState => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pageIndex, setPageIndex] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || defaultPageSize);
	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

	// useEffect(() => {
	// 	const params: Record<string, string> = {};
	// 	if (pageIndex !== 1) params.page = String(pageIndex);
	// 	if (pageSize) params.pageSize = String(pageSize);
	//
	// 	setSearchParams(params, { replace: true });
	// }, [pageIndex, pageSize, searchQuery, setSearchParams]);

	return {
		pageIndex,
		setPageIndex,
		pageSize,
		setPageSize,
		searchQuery,
		setSearchQuery,
		sorting,
		setSorting
	};
};
