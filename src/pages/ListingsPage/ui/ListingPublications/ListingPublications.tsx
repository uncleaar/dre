import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import {
	createListingPublication,
	deleteListingPublication,
	getListingPublication,
	updateListingPublication
} from "shared/api/listing-publications";
import { PublicationStatuses } from "shared/constants/publication-statuses";
import { PublicationTypes } from "shared/constants/publication-types";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import usePublicationStore from "shared/stores/publications/usePublicationStore";

import { Button, Divider, Flex, Grid, InputWrapper, Tabs } from "@mantine/core";
import { NotificationData, notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ListingPublication } from "../../../../types/listing-publications-list";
import { PublicationTabList } from "../Tabs/PublicationTabList.tsx";

import { ListingContacts } from "./ui/ListingContacts/ListingContacts";
import { ListingCoreData } from "./ui/ListingCoreData/ListingCoreData";
import { ListingHighlights } from "./ui/ListingHighlights/ListingHighlights";
import { ListingPricing } from "./ui/ListingPricingData/ListingPricingData.tsx";
import { ListingProperties } from "./ui/ListingProperties/ListingProperties";
import { ListingPublicationImages } from "./ui/ListingPublicationImages/ListingPublicationImages";
import { ListingPublicationVideos } from "./ui/ListingPublicationVideos/ListingPublicationVideos.tsx";
import { ListingSettings } from "./ui/ListingSettings/ListingSettings";

import styles from "./ListingPublications.module.scss";

interface PublicationsProps {}

export const ListingPublications: FC<PublicationsProps> = () => {
	const { photos, videos, selectedPubTab } = usePublicationStore();
	const queryClient = useQueryClient();
	const { id } = useParams<string>();
	const [publicationType, setPublicationType] = useState(PublicationTypes[0]);
	const [publicationStatus, setPublicationStatus] = useState(PublicationStatuses[0]);

	const { data: publication, isLoading: isLoadingPublication } = useQuery<ListingPublication>({
		queryKey: ["publications", selectedPubTab],
		queryFn: () =>
			getListingPublication(selectedPubTab as string, {
				contacts: true
			}),
		enabled: !!selectedPubTab
	});

	useEffect(() => {
		if (publication) {
			if (publication?.status) {
				const result = PublicationStatuses.find((item) => item.value === publication?.status);
				if (result) {
					setPublicationStatus(result);
				}
			} else {
				setPublicationStatus(PublicationStatuses[0]);
			}

			if (publication?.publicationType) {
				const result = PublicationTypes.find((item) => item.value === publication?.publicationType);
				if (result) {
					setPublicationType(result);
				}
			} else {
				setPublicationType(PublicationTypes[0]);
			}
		}
	}, [publication]);

	const {
		mutate: create,
		isLoading: isLoadingCreate,
		isError
	} = useMutation({
		mutationKey: ["publications"],
		mutationFn: async (listingId: string) => await createListingPublication(listingId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["publications"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.publication_create });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while creating the publication."
			});
		}
	});

	const { mutate: deleteListingPub, isLoading: isLoadingDeleteUser } = useMutation({
		mutationKey: ["publications"],
		mutationFn: async (listingId: string) => await deleteListingPublication(listingId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["publications"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.publication_delete });
		},
		onError: (error: any) => {
			notifications.show({ title: "Error", message: error.message });
		}
	});

	const { mutate: update } = useMutation({
		mutationKey: ["publications"],
		mutationFn: async ({ data, id }: { data: Partial<ListingPublication>; id: string }) =>
			await updateListingPublication(data, id),
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

	const onSubmit = async () => {
		if (id) {
			create(id);
		} else {
			notifications.show({ title: "Error", message: "error" });
		}
	};

	const onStatusChange = async (value: { value: string; label: string }) => {
		setPublicationStatus(value);
		if (publication?.id) {
			update({ data: { status: value.value }, id: publication?.id });
		}
	};
	const onTypeChange = async (value: { value: string; label: string }) => {
		setPublicationType(value);
		if (publication?.id) {
			update({ data: { publicationType: value.value }, id: publication.id });
		}
	};
	const onPublish = () => {
		if (!photos.length || !videos.length) {
			notifications.show({
				title: "Warning",
				message: "You need to select at least one image or video",
				color: "yellow"
			} as NotificationData);
			return;
		}
	};
	return (
		<Tabs m="lg" variant="outline">
			<PublicationTabList
				onSubmit={onSubmit}
				isLoading={isLoadingCreate}
				tooltip={"Create listing publication"}
			/>

			{/*	<Tooltip label='Create data for listing publication'>
				<Button radius='xl' variant='transparent' onClick={open} >
					+
				</Button>
			</Tooltip>
*/}

			{/*<Modal
				opened={opened}
				onClose={close}
				title='Create listing publication'
				centered
			>
				<Box className={styles.box_inner}>
					{isLoadingPublication ? (
						<div>Loading details...</div>
					) : publication && publication.id ? (
						<ListingPublicationForm id={publication.id}/>
					) : null}
				</Box>
			</Modal>*/}

			{publication && publication.id && (
				<Tabs.Panel value={publication.id} className={styles.tab_panel}>
					<Flex justify="space-between" align="center">
						<p>Details: {publication.id}</p>
						<Flex justify="flex-end" gap={16}>
							<Button onClick={onPublish} variant="outline">
								Publish
							</Button>
							<Button color="red" onClick={() => deleteListingPub(publication.id)} variant="outline">
								Delete
							</Button>
						</Flex>
					</Flex>
					<Divider mt={8} mb={8} />
					<Grid mb={24} classNames={{ inner: styles.inner }}>
						<Grid.Col span={3}>
							<InputWrapper description="Publication Type">
								<Select options={PublicationTypes} value={publicationType} onChange={onTypeChange as any} />
							</InputWrapper>
						</Grid.Col>
						<Grid.Col span={3}>
							<InputWrapper description="Publication Status">
								<Select
									options={PublicationStatuses}
									value={publicationStatus}
									onChange={onStatusChange as any}
								/>
							</InputWrapper>
						</Grid.Col>
					</Grid>
					<Divider mt={8} mb={8} />
					<Grid>
						<Grid.Col span={6}>
							<ListingProperties listingId={publication.id} />
							<Divider my={50} />
							<ListingHighlights
								listingId={publication.id}
								categories={publication?.highlightCategories}
							/>
							<Divider my={50} />
							<ListingContacts
								listingId={publication.id}
								contacts={publication?.contacts}
								contactsData={publication?.contactsData}
							/>
							<Divider my={50} />
							<ListingPublicationImages />
							<ListingPublicationVideos />
						</Grid.Col>
						<Grid.Col span={6}>
							<ListingCoreData publication={publication} />
							<Divider my={25} />
							<ListingSettings />
							<Divider my={25} />
							<ListingPricing publication={publication} />
							<Divider my={50} />
						</Grid.Col>
					</Grid>
				</Tabs.Panel>
			)}
		</Tabs>
	);
};
