import React, { FC, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getListingPublicationsUnit } from "shared/api/listing-publications-units";
import { getPhotos } from "shared/api/photos";
import { getUnit } from "shared/api/units";
import { getVideos } from "shared/api/videos.ts";
import { combineContacts } from "shared/lib/combineContacts/combineContacts.ts";
import useUnitStore from "shared/stores/units/useUnitStore.ts";
import { MediaFileInput } from "shared/ui/MediaFileInput/MediaFileInput";

import { Box, Divider, Flex, Grid, ScrollArea, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { Amenities } from "../../../../widgets/Amenities";
import { Contacts } from "../../../../widgets/Contacts";
import { Images } from "../../../../widgets/Images/Images";
import { Videos } from "../../../../widgets/Videos/Videos.tsx";
import { RoomsList } from "../Rooms";

import styles from "./UnitView.module.scss";

interface UnitViewProps {}

export const UnitView: FC<UnitViewProps> = () => {
	const { id } = useParams();
	const { listingId } = useParams();
	const { photos, setUnitPhotosData, setUnitVideosData, videos } = useUnitStore();

	const { data, isLoading } = useQuery({
		queryKey: [!listingId ? "units" : "listing-publication-units", id, listingId],
		queryFn: !listingId
			? async () => getUnit(id as string, { contacts: true, amenities: true, utilities: true })
			: async () => getListingPublicationsUnit(listingId, id as string, { contacts: true }),
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
		queryFn: async () => await getVideos(id as string, { page: videos.page, perPage: videos.perPage })
	});

	const contacts = useMemo(() => {
		if (data && data.contactsData) {
			return combineContacts(data.contactsData as any, data.contacts);
		}
		return [];
	}, [data]);
	useEffect(() => {
		if (imageData) {
			setUnitPhotosData({
				page: imageData.meta.page,
				total: imageData.meta.total,
				data: imageData.list
			});
		}
		if (videoData) {
			setUnitVideosData({
				page: videoData.meta.page,
				total: videoData.meta.total,
				data: videoData.list
			});
		}
	}, [imageData, setUnitPhotosData, setUnitVideosData, videoData]);

	if (isLoading) return <p>loading</p>;

	return (
		<>
			<Text>Unit info</Text>
			<Divider my={10} />
			<Flex gap={20}>
				<div>Name: {data?.unitName}</div>
				<div>Status: {data?.status}</div>
				<div>Floor: {data?.floor}</div>
				<div>Have key: {data?.haveKey ? "Yes" : "No"}</div>
				<div>Has lock box: {data?.hasLockbox ? "Yes" : "No"}</div>
				<div>For sale: {data?.forSale ? "Yes" : "No"}</div>
				<div>For rent: {data?.forRent ? "Yes" : "No"}</div>
			</Flex>

			<Divider my={10} />

			<Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }} mb={30}>
				<Grid.Col span={6}>
					<Text size="xl" fw={700}>
						Unit facts
					</Text>
					<Box className={styles.inner} p={20}>
						<Text size="lg" fw={700}>
							Unit overview
						</Text>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Fee type: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.feeType}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Unit number: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.unitNumber}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Floor: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.floor}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Unit name: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.unitName}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Unit rent: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.unitRent}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Shifting fee price: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.shiftingFeePrice}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Lock box type: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.lockboxType}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Key archive number: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.keyArchiveNumber}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Lock box code: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.lockboxCode}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Alt unit number: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.altUnitNumber}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Special price: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.specialPrice}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Special price note: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.specialPriceNote}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Sqrt ft: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>{data?.SqrFt}</Text>
							</Grid.Col>
						</Grid>
						<Grid mt={4}>
							<Grid.Col span={6}>
								<Text fw={500}>Fee percentage: </Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text fw={300}>
									{data?.feePercentage}
									{data?.feePercentage ? "%" : ""}
								</Text>
							</Grid.Col>
						</Grid>
					</Box>
					<Box className={styles.inner}>
						<ScrollArea h={600}>
							<Images entity="unit" entityId={id as string} />
							<Divider my={16} />
							<Videos entity="unit" entityId={id as string} />
							<MediaFileInput entityId={id as string} />
						</ScrollArea>
					</Box>
				</Grid.Col>
				<Grid.Col span={6}>
					<Box>
						<Title order={4}>Contacts</Title>
						<Contacts contacts={contacts} />
					</Box>
					<Box className={styles.inner} p={20}>
						<Title order={4}>Amenities</Title>
						<Amenities amenities={data?.amenities || []} />
					</Box>
				</Grid.Col>
			</Grid>

			<RoomsList unitId={id} />
		</>
	);
};
