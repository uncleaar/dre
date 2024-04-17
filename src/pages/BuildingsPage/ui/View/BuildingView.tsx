import React, { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { getBuildingById } from "shared/api/buildings";
import { getListingPublicationsBuilding } from "shared/api/listing-publications-buildings";
import { getPhotos } from "shared/api/photos";
import { getVideos } from "shared/api/videos.ts";
import { combineContacts } from "shared/lib/combineContacts/combineContacts.ts";
import { transformBuildingToFormValues } from "shared/lib/transformBuildingToFormValues";
import useBuildingStore from "shared/stores/buildings/useBuildingStore.ts";
import { MediaFileInput } from "shared/ui/MediaFileInput/MediaFileInput";
import { Contacts } from "widgets/Contacts";

import { Box, Button, Divider, Flex, Grid, Loader, ScrollArea, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { Images } from "../../../../widgets/Images/Images";
import { Videos } from "../../../../widgets/Videos/Videos.tsx";

import { BuildingFacts } from "./ui/BuildingFacts";
import { BuildingFeedbacks } from "./ui/BuildingFeedbacks";

import styles from "./BuildingView.module.scss";

export const BuildingView: FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { listingId } = useParams<{ listingId: string }>();
	const { setBuildingPhotosData, photos, setBuildingVideosData, videos } = useBuildingStore();
	const { data, isLoading } = useQuery({
		queryKey: [!listingId ? "buildings" : "listing-publication-buildings", id, listingId],
		queryFn: !listingId
			? async () => getBuildingById(id as string, { contacts: true, amenities: true, utilities: true })
			: async () => getListingPublicationsBuilding(listingId, id as string, { contacts: true }),
		keepPreviousData: true
	});

	const { data: imageData } = useQuery({
		queryKey: ["photos", id, photos.page],
		queryFn: async () =>
			await getPhotos(id as string, { page: photos.page, perPage: photos.perPage }),
		keepPreviousData: true
	});

	const { data: videoData } = useQuery({
		queryKey: ["videos", id],
		queryFn: async () =>
			await getVideos(id as string, { page: videos.page, perPage: videos.perPage }),
		keepPreviousData: true
	});

	const buildingData = useMemo(() => {
		if (data) {
			return transformBuildingToFormValues(data);
		}
		return null;
	}, [data]);

	const contacts = useMemo(() => {
		if (data && data.contactsData) {
			return combineContacts(data.contactsData, data.contacts);
		}
		return [];
	}, [data]);

	useEffect(() => {
		if (imageData) {
			setBuildingPhotosData({
				page: imageData.meta.page,
				total: imageData.meta.total,
				data: imageData.list
			});
		}
		if (videoData) {
			setBuildingVideosData({
				page: videoData.meta.page,
				total: videoData.meta.total,
				data: videoData.list
			});
		}
	}, [imageData, setBuildingPhotosData, setBuildingVideosData, videoData]);

	if (isLoading) return <Loader classNames={{ root: styles.loader }} color="blue" />;
	return (
		<Box>
			<Flex justify={"space-between"}>
				<Text size="xl" fw={700}>
					Building Info
				</Text>
				<Button color="teal">DOWNLOAD AS PDF</Button>
			</Flex>
			<Divider my="sm" />
			<Flex>
				<Text className={styles.margin_right}>Name: {buildingData?.name}</Text>
				<Text className={styles.margin_right}>Activate: {buildingData?.activate ? "Yes" : "No"}</Text>
				<Text className={styles.margin_right}>Building Type: {buildingData?.buildingType}</Text>
			</Flex>
			<Divider my="sm" />
			<Grid className={styles.margin_bottom}>
				<Grid.Col span={7}>
					<Title order={4}>Building Facts</Title>

					<BuildingFacts buildingData={buildingData} />
				</Grid.Col>
				<Grid.Col span={5}>
					<Title order={4}>Contacts</Title>

					<Contacts contacts={contacts} />
				</Grid.Col>
			</Grid>
			<Grid className={styles.margin_bottom}>
				<Grid.Col span={6}>
					<Title order={4}>Feedbacks</Title>

					<BuildingFeedbacks feedbacks={data?.feedbacks || []} />
				</Grid.Col>
				<Grid.Col span={6}>
					<Title order={4}>Images</Title>
					<Box className={styles.box}>
						<ScrollArea h={600}>
							<Images entity="building" entityId={id as string} />
							<Divider my={16} />
							<Videos entity="building" entityId={id as string} />
							<MediaFileInput entityId={id as string} />
						</ScrollArea>
					</Box>
				</Grid.Col>
			</Grid>
			<Button onClick={() => navigate(-1)}>Back</Button>
		</Box>
	);
};
