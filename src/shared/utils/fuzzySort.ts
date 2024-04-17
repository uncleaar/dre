import { compareItems } from "@tanstack/match-sorter-utils";
import { SortingFn, sortingFns } from "@tanstack/react-table";

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
	let dir = 0;

	if (rowA.columnFiltersMeta[columnId]) {
		dir = compareItems(
			rowA.columnFiltersMeta[columnId]?.itemRank,
			rowB.columnFiltersMeta[columnId]?.itemRank
		);
	}

	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};
