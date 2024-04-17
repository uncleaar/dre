import React, { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import {
	createListingPublicationUnit,
	getListingPublicationsUnits
} from "shared/api/listing-publications-units";
import { getListingById } from "shared/api/listings";

import { Box, Button, Flex, InputWrapper } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Listing } from "../../../../../../types/listings";

interface ListingPublicationUnitCreateProps {
	id: string;
	close: () => void;
}

export const ListingPublicationUnitCreate: FC<ListingPublicationUnitCreateProps> = ({
	id,
	close
}) => {
	const { id: listing_id } = useParams();
	const queryClient = useQueryClient();
	const [unit, setUnit] = useState<any>({});

	const { data: listing } = useQuery<Listing>({
		queryKey: ["listings", listing_id],
		queryFn: () => getListingById(listing_id as string),
		enabled: !!listing_id
	});

	const { data: publicationUnits } = useQuery({
		queryKey: ["listing-publication-units", id],
		queryFn: () => getListingPublicationsUnits({ listingPublicationId: id }),
		enabled: !!id
	});

	const { mutate: createUnits, isLoading: isLoadingCreateUnit } = useMutation({
		mutationKey: ["listing-publication-units"],
		mutationFn: async (unitId: string) => await createListingPublicationUnit(id, unitId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["listing-publication-units"] });
			notifications.show({
				title: "Success",
				message: "Listing publication unit created successfully"
			});
			close();
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const unitsData = useMemo(() => {
		if (listing && publicationUnits?.list) {
			const idSet = new Set(publicationUnits?.list.map((obj) => obj.id));
			return listing?.units.filter((obj) => !idSet.has(obj.id));
		}
		return [];
	}, [publicationUnits, listing]);

	const options = useMemo(() => {
		return unitsData.map((b) => ({
			value: b.id,
			label: b.unitName,
			...b
		}));
	}, [unitsData]);

	const onSubmit = async (data: any) => {
		try {
			if (unit?.id) {
				createUnits(unit.id);
			}
		} catch (error: any) {
			notifications.show({ title: "Error", message: error.message });
		}
	};

	return (
		<Flex style={{ minHeight: 400 }} direction="column" justify="space-between">
			<Box>
				<Select options={options} onChange={(value) => setUnit(value)} />
			</Box>
			<Button onClick={onSubmit} loading={isLoadingCreateUnit} w={200} disabled={!unit?.id}>
				Submit
			</Button>
		</Flex>
	);
};
