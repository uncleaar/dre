import dayjs from "dayjs";
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
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ListingPublication } from "../../../../../../types/listing-publications-list";

interface ListingCoreDataProps {
	publication: ListingPublication;
}

export const ListingCoreData: FC<ListingCoreDataProps> = ({ publication }) => {
	const queryClient = useQueryClient();
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({
		shortestLeaseDuration: publication.shortestLeaseDuration,
		shortestLeasePriceDiff: publication.shortestLeasePriceDiff,
		longestLeaseDuration: publication.longestLeaseDuration,
		longestLeasePriceDiff: publication.longestLeasePriceDiff,
		turnoverHandler: publication.turnoverHandler,
		officialAvailabilityDate: publication.officialAvailabilityDate
			? new Date(publication.officialAvailabilityDate)
			: null,
		tenantLeaseExpirationDate: publication.tenantLeaseExpirationDate
			? new Date(publication.tenantLeaseExpirationDate)
			: null,
		tenantVacateNotice: publication.tenantVacateNotice
			? new Date(publication.tenantVacateNotice)
			: null,
		landlordUpgrades: publication.landlordUpgrades.join(", "),
		tenantUpgrades: publication.tenantUpgrades.join(", ")
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
			shortestLeaseDuration: Number(editedData.shortestLeaseDuration),
			shortestLeasePriceDiff: Number(editedData.shortestLeasePriceDiff),
			longestLeaseDuration: Number(editedData.longestLeaseDuration),
			longestLeasePriceDiff: Number(editedData.longestLeasePriceDiff),
			turnoverHandler: editedData.turnoverHandler,
			officialAvailabilityDate: editedData.officialAvailabilityDate,
			tenantLeaseExpirationDate: editedData.tenantLeaseExpirationDate,
			tenantVacateNotice: editedData.tenantVacateNotice,
			landlordUpgrades: editedData.landlordUpgrades.split(",").map(String),
			tenantUpgrades: editedData.tenantUpgrades.split(",").map(String)
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
					<Title order={5}>Core data</Title>
				</Accordion.Control>
				<AccordionPanel>
					<Table withColumnBorders withTableBorder withRowBorders mb={16}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td w="50%">
									<Title order={6}>Leasing options</Title>
								</Table.Td>
								<Table.Td w="50%"></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Shortest Lease Duration</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="number"
											value={editedData.shortestLeaseDuration}
											onChange={(e) => handleInputChange("shortestLeaseDuration", e.target.value)}
										/>
									) : (
										publication.shortestLeaseDuration
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Shortest Lease Price Diff</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="number"
											value={editedData.shortestLeasePriceDiff}
											onChange={(e) => handleInputChange("shortestLeasePriceDiff", e.target.value)}
										/>
									) : (
										publication.shortestLeasePriceDiff
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Longest Lease Duration</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="number"
											value={editedData.longestLeaseDuration}
											onChange={(e) => handleInputChange("longestLeaseDuration", e.target.value)}
										/>
									) : (
										publication.longestLeaseDuration
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Longest Lease Price Diff</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="number"
											value={editedData.longestLeasePriceDiff}
											onChange={(e) => handleInputChange("longestLeasePriceDiff", e.target.value)}
										/>
									) : (
										publication.longestLeasePriceDiff
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<Title order={6}>Upgrades/Add-ons </Title>
								</Table.Td>
								<Table.Td></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Landlord Upgrades</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="text"
											value={editedData.landlordUpgrades}
											onChange={(e) => handleInputChange("landlordUpgrades", e.target.value)}
										/>
									) : (
										publication.landlordUpgrades.join(", ")
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Tenant Upgrades</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="text"
											value={editedData.tenantUpgrades}
											onChange={(e) => handleInputChange("tenantUpgrades", e.target.value)}
										/>
									) : (
										publication.tenantUpgrades.join(", ")
									)}
								</Table.Td>
							</Table.Tr>

							<Table.Tr>
								<Table.Td>
									<Title order={6}>Availability</Title>
								</Table.Td>
								<Table.Td></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Official availability date</Table.Td>
								<Table.Td>
									{isEditing ? (
										<DateInput
											size="xs"
											value={editedData.officialAvailabilityDate as any}
											onChange={(value) => handleInputChange("officialAvailabilityDate", value as any)}
										/>
									) : (
										<>{dayjs(publication.officialAvailabilityDate).format("DD/MM/YYYY")}</>
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td h={45}>- Tenant lease expiration date</Table.Td>
								<Table.Td>
									{isEditing ? (
										<DateInput
											size="xs"
											value={editedData.tenantLeaseExpirationDate as any}
											onChange={(value) => handleInputChange("tenantLeaseExpirationDate", value as any)}
										/>
									) : (
										<>{dayjs(publication.tenantLeaseExpirationDate).format("DD/MM/YYYY")}</>
									)}
								</Table.Td>
							</Table.Tr>

							<Table.Tr>
								<Table.Td h={45}>- Tenant vacate notice</Table.Td>
								<Table.Td>
									{isEditing ? (
										<DateInput
											size="xs"
											value={editedData.tenantVacateNotice as any}
											onChange={(value) => handleInputChange("tenantVacateNotice", value as any)}
										/>
									) : (
										<>{dayjs(publication.tenantVacateNotice).format("DD/MM/YYYY")}</>
									)}
								</Table.Td>
							</Table.Tr>

							<Table.Tr>
								<Table.Td h={45}>- Turnover handler</Table.Td>
								<Table.Td>
									{isEditing ? (
										<Input
											size="xs"
											type="text"
											value={editedData.turnoverHandler}
											onChange={(e) => handleInputChange("turnoverHandler", e.target.value)}
										/>
									) : (
										publication.turnoverHandler
									)}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					{isEditing ? (
						<Flex justify="flex-end" gap={20}>
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
