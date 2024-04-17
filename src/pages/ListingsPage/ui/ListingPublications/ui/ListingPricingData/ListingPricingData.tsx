import React, { FC, useState } from "react";
import { updateListingPublication } from "shared/api/listing-publications.ts";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages.ts";
import { Input } from "shared/ui";

import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	Button,
	Flex,
	Table,
	Title
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ListingPublication } from "../../../../../../types/listing-publications-list";

interface ListingPricingDataProps {
	publication: ListingPublication;
}

export const ListingPricing: FC<ListingPricingDataProps> = ({ publication }) => {
	const queryClient = useQueryClient();
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({
		landlordsPriceCents: publication.landlordsPriceCents,
		publicationPriceCents: publication.publicationPriceCents,
		incentives: publication.incentives,
		startBidCents: publication.startBidCents,
		reversePriceCents: publication.reversePriceCents,
		legalRent: publication.legalRent
	});

	const { mutate } = useMutation({
		mutationKey: ["publications"],
		mutationFn: async (data: ListingPublication) =>
			await updateListingPublication(data, publication.id as string),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["publications"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.publication_update });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while updating the building."
			});
		}
	});

	const handleEditClick = () => {
		setIsEditing(!isEditing);
	};

	const handleSaveClick = () => {
		setIsEditing(false);

		const numericData = {
			landlordsPriceCents: Number(editedData.landlordsPriceCents),
			publicationPriceCents: Number(editedData.publicationPriceCents),
			incentives: editedData.incentives,
			startBidCents: Number(editedData.startBidCents),
			reversePriceCents: Number(editedData.reversePriceCents),
			legalRent: editedData.legalRent
		};
		mutate(numericData as any);
	};

	const handleCancelClick = () => {
		setIsEditing(false);
	};

	const handleInputChange = (field: string, value: string) => {
		setEditedData((prevData) => ({
			...prevData,
			[field]: value
		}));
	};

	return (
		<Accordion variant="contained" defaultValue="data">
			<AccordionItem value="data">
				<Accordion.Control>
					<Title order={5}>Pricing data</Title>
				</Accordion.Control>
				<AccordionPanel>
					<Table withColumnBorders withTableBorder withRowBorders mb={16}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td w="50%">
									<Title order={6}>Prices</Title>
								</Table.Td>
								<Table.Td w="50%"></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Landlord price</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="number"
											value={editedData.landlordsPriceCents}
											onChange={(e) => handleInputChange("landlordsPriceCents", e.target.value)}
										/>
									) : (
										publication.landlordsPriceCents
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Publication price</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="number"
											value={editedData.publicationPriceCents}
											onChange={(e) => handleInputChange("publicationPriceCents", e.target.value)}
										/>
									) : (
										publication.publicationPriceCents
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<Title order={6}>Incentives</Title>
								</Table.Td>
								<Table.Td></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Incentives required rent time</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="text"
											value={editedData.incentives}
											onChange={(e) => handleInputChange("incentives", e.target.value)}
										/>
									) : (
										publication.incentives
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Starts bid cents</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="number"
											value={editedData.startBidCents}
											onChange={(e) => handleInputChange("startBidCents", e.target.value)}
										/>
									) : (
										publication.startBidCents
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Reserve price</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="number"
											value={editedData.reversePriceCents}
											onChange={(e) => handleInputChange("reversePriceCents", e.target.value)}
										/>
									) : (
										publication.reversePriceCents
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<Title order={6}>Rent stabilized</Title>
								</Table.Td>
								<Table.Td></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Legal rent</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="text"
											value={editedData.legalRent}
											onChange={(e) => handleInputChange("legalRent", e.target.value)}
										/>
									) : (
										publication.legalRent
									)}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					{isEditing ? (
						<Flex gap={20} justify="flex-end">
							<Button variant="outline" color="red" onClick={handleCancelClick}>
								Cancel
							</Button>
							<Button variant="outline" onClick={handleSaveClick}>
								Save
							</Button>
						</Flex>
					) : (
						<Flex justify="flex-end">
							<Button variant="outline" onClick={handleEditClick}>
								Edit
							</Button>
						</Flex>
					)}
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	);
};
