import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getListingById } from "shared/api/listings.ts";
import useListingStore from "shared/stores/listings/useListingStore.ts";

import { Divider, Flex, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { Listing } from "../../../../types/listings.ts";
import { ListingTabs } from "../Tabs/ListingTabs";

interface ListingViewProps {}

export const ListingView: FC<ListingViewProps> = () => {
	const { id } = useParams();
	const { setListingData } = useListingStore();
	const { data } = useQuery<Listing>({
		queryKey: ["listings", id],
		queryFn: () => getListingById(id as string),
		enabled: !!id
	});
	useEffect(() => {
		if (data) {
			setListingData(data);
		}
	}, [data, setListingData]);
	return (
		<div>
			<Flex gap={30}>
				<Flex gap={8}>
					<Text fw={600}>Listing Id:</Text>
					<Text>{data?.id}</Text>
				</Flex>
				<Flex gap={8}>
					<Text fw={600}>Buildings:</Text>
					<Text>{data?.buildings.length}</Text>
				</Flex>
				<Flex gap={8}>
					<Text fw={600}>Units:</Text>
					<Text>{data?.units.length}</Text>
				</Flex>
				<Flex gap={8}>
					<Text fw={600}>Rooms:</Text>
					<Text>{data?.rooms.length}</Text>
				</Flex>
				<Flex gap={8}>
					<Text fw={600}>Status:</Text>
					<Text>{data?.status}</Text>
				</Flex>
				<Flex gap={8}>
					<Text fw={600}>Notes:</Text>
					<Text>{data?.notes}</Text>
				</Flex>
			</Flex>
			<Divider />
			<ListingTabs />
		</div>
	);
};
