import { FC, useEffect, useState } from "react";
import { Input } from "shared/ui";

import { Flex, MultiSelect } from "@mantine/core";
import { IconFilter, IconSearch } from "@tabler/icons-react";

interface SearchProps {
	onSearchChange?: (value: string) => void;
	onFilterChange?: (value: string[]) => void;
	filter?: {
		title: string;
		data: string[];
	};
}

export const Search: FC<SearchProps> = ({ onFilterChange, onSearchChange, filter }) => {
	const [searchValue, setSearchValue] = useState("");

	useEffect(() => {
		onSearchChange?.(searchValue);
	}, [searchValue]);

	const setFilter = (v: string[]) => {
		onFilterChange?.(v);
	};

	const icon = <IconFilter size={16} />;
	return (
		<Flex mb={16}>
			<Input
				size="xs"
				radius="sm"
				mr={16}
				icon={<IconSearch size={12} />}
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
			/>
			{filter ? (
				<MultiSelect
					variant="unstyled"
					rightSection={icon}
					placeholder={filter?.title}
					onChange={setFilter}
					data={filter?.data}
				/>
			) : null}
		</Flex>
	);
};
