import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getListingPublications } from "shared/api/listing-publications.ts";
import usePublicationStore from "shared/stores/publications/usePublicationStore.ts";

import { ActionIcon, Box, Flex, Pagination, Tabs, Text, Tooltip } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { ListingPublicationsList } from "../../../../types/listing-publications-list.ts";

import styles from "../ListingPublications/ListingPublications.module.scss";

export const PublicationTabList = ({
	onSubmit,
	isLoading,
	tooltip
}: {
	onSubmit: () => void;
	isLoading: boolean;
	tooltip: string;
}) => {
	const { id } = useParams<string>();
	const { setPublicationStoreData } = usePublicationStore();
	const [currentPage, setCurrentPage] = useState(1);
	const [publicationsPerPage] = useState(5);

	const { data: publications } = useQuery<ListingPublicationsList>({
		queryKey: ["publications", currentPage, publicationsPerPage, id],
		queryFn: () =>
			getListingPublications({
				page: currentPage,
				perPage: publicationsPerPage,
				listingSearch: id
			}),
		keepPreviousData: true,
		getNextPageParam: (lastPage, allPages) => lastPage.meta.page + 1
	});
	const handlePublicationClick = (publicationId: string) => {
		setPublicationStoreData({ videos: [], photos: [], selectedPubTab: publicationId });
	};

	return (
		<>
			<Tabs.List>
				{publications?.list.map((item, i) => (
					<Flex align="center" key={i}>
						<Tabs.Tab
							value={item.id}
							key={item.id}
							onClick={() => handlePublicationClick(item.id)}
							className={styles.tabs_tab}
						>
							<Box w={150}>
								<Text truncate="end">
									{item.status} - {item.id}
								</Text>
							</Box>
						</Tabs.Tab>
					</Flex>
				))}
				<Tooltip label={tooltip}>
					<ActionIcon variant="transparent" mt={10} c="#868E96" onClick={onSubmit} loading={isLoading}>
						<IconCirclePlus />
					</ActionIcon>
				</Tooltip>
			</Tabs.List>
			<Pagination
				total={
					publications && publications?.meta?.total
						? Math.ceil(publications.meta.total / publicationsPerPage)
						: 0
				}
				onChange={setCurrentPage}
				color="teal"
				withEdges
			/>
		</>
	);
};
