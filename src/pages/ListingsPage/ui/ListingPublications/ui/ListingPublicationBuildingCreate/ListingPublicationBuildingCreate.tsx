import React, { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import {
	createListingPublicationBuilding,
	getListingPublicationsBuildings
} from "shared/api/listing-publications-buildings";
import { getListingById } from "shared/api/listings";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";

import { Box, Button, Flex, InputWrapper } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Listing } from "../../../../../../types/listings";

interface ListingPublicationBuildingCreateProps {
	id: string;
	close: () => void;
}

export const ListingPublicationBuildingCreate: FC<ListingPublicationBuildingCreateProps> = ({
	id,
	close
}) => {
	const { id: listing_id } = useParams();
	const queryClient = useQueryClient();
	const [building, setBuilding] = useState<any>({});

	const { data: listing } = useQuery<Listing>({
		queryKey: ["listings", listing_id],
		queryFn: () => getListingById(listing_id),
		enabled: !!listing_id
	});

	const { data: publicationBuildings } = useQuery({
		queryKey: ["listing-publication-buildings", id],
		queryFn: () => getListingPublicationsBuildings({ listingPublicationId: id }),
		enabled: !!id
	});

	const { mutate: createBuilding, isLoading: isLoadingCreateBuilding } = useMutation({
		mutationKey: ["listing-publication-buildings"],
		mutationFn: async (buildingId: string) => await createListingPublicationBuilding(id, buildingId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["listing-publication-buildings"] });
			close();
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.listing_create_building });
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const buildingsData = useMemo(() => {
		if (listing && publicationBuildings?.list) {
			const idSet = new Set(publicationBuildings?.list.map((obj) => obj.id));
			return listing?.buildings.filter((obj) => !idSet.has(obj.id));
		}
		return [];
	}, [publicationBuildings, listing]);

	const options = useMemo(() => {
		return buildingsData.map((b) => ({
			value: b.id,
			label: b.name,
			...b
		}));
	}, [buildingsData]);

	const onSubmit = async () => {
		try {
			if (building?.id) {
				createBuilding(building.id);
			}
		} catch (error: any) {
			notifications.show({ title: "Error", message: error.message });
		}
	};

	return (
		<Flex style={{ minHeight: 400 }} direction="column" justify="space-between">
			<Box>
				<Select options={options} onChange={(value) => setBuilding(value)} />
			</Box>
			<Button onClick={onSubmit} loading={isLoadingCreateBuilding} w={200} disabled={!building?.id}>
				Submit
			</Button>
		</Flex>
	);
};
