import dayjs from "dayjs";
import React, { FC, useEffect, useMemo } from "react";
import { getListingPublicationsRoom } from "shared/api/listing-publications-rooms";
import { getPhotos } from "shared/api/photos";
import { getRoom } from "shared/api/rooms";
import { getVideos } from "shared/api/videos.ts";
import { combineContacts } from "shared/lib/combineContacts/combineContacts.ts";
import useRoomStore from "shared/stores/rooms/useRoomStore.ts";
import { MediaFileInput } from "shared/ui/MediaFileInput/MediaFileInput";
import { Contacts } from "widgets/Contacts";

import { Box, Button, Divider, Flex, Grid, Loader, Text, Title } from "@mantine/core";
import { ScrollArea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { Amenity } from "../../../../../../types/amenities.ts";
import { Amenities } from "../../../../../../widgets/Amenities";
import { Images } from "../../../../../../widgets/Images/Images";
import { Videos } from "../../../../../../widgets/Videos/Videos.tsx";

import styles from "./RoomView.module.scss";

interface RoomViewProps {
	roomId: string;
	onClose: () => void;
	listingId?: string;
}

export const RoomView: FC<RoomViewProps> = ({ roomId, onClose, listingId }: RoomViewProps) => {
	const { photos, setRoomPhotosData, setRoomVideosData, videos } = useRoomStore();
	const { data, isLoading } = useQuery({
		queryKey: [!listingId ? "rooms" : "listing-publication-rooms", roomId],
		queryFn: !listingId
			? async () => getRoom(roomId, { contacts: true, amenities: true, utilities: true })
			: async () => getListingPublicationsRoom(listingId as string, roomId as string),
		keepPreviousData: true
	});

	const contacts = useMemo(() => {
		if (data && data.contactsData) {
			return combineContacts(data.contactsData, data.contacts);
		}
		return [];
	}, [data]);

	const { data: imageData } = useQuery({
		queryKey: ["photos", roomId, photos.page],
		queryFn: async () => await getPhotos(roomId, { page: photos.page, perPage: photos.perPage }),
		keepPreviousData: true
	});
	const { data: videoData } = useQuery({
		queryKey: ["videos", roomId],
		queryFn: async () =>
			await getVideos(roomId as string, { page: videos.page, perPage: videos.perPage })
	});
	useEffect(() => {
		if (imageData) {
			setRoomPhotosData({
				page: imageData.meta.page,
				total: imageData.meta.total,
				data: imageData.list
			});
		}
		if (videoData) {
			setRoomVideosData({
				page: videoData.meta.page,
				total: videoData.meta.total,
				data: videoData.list
			});
		}
	}, [imageData, setRoomPhotosData, setRoomVideosData, videoData]);

	if (isLoading) return <Loader color="blue" />;
	return (
		<>
			<Box className={styles.inner}>
				<Grid>
					<Grid.Col span={6}>
						<Title order={5}>Room Facts</Title>
						<Box className={styles.inner}>
							<Grid mt={4}>
								<Grid.Col span={6}>
									<Text fw={500}>Room Type: </Text>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fw={300}>{data?.roomType || "-"}</Text>
								</Grid.Col>
							</Grid>
							<Grid mt={4}>
								<Grid.Col span={6}>
									<Text fw={500}>Room Number: </Text>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fw={300}>{data?.roomNumber || "-"}</Text>
								</Grid.Col>
							</Grid>
							<Grid mt={4}>
								<Grid.Col span={6}>
									<Text fw={500}>Status: </Text>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fw={300}>{data?.status || "-"}</Text>
								</Grid.Col>
							</Grid>
							<Grid mt={4}>
								<Grid.Col span={6}>
									<Text fw={500}>Availability: </Text>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fw={300}>{dayjs(data?.availability).format("YYYY-MM-DD") || "-"}</Text>
								</Grid.Col>
							</Grid>

							<Grid mt={4}>
								<Grid.Col span={6}>
									<Text fw={500}>Fee type: </Text>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fw={300}>{data?.feeType || "-"}</Text>
								</Grid.Col>
							</Grid>
							<Grid mt={4}>
								<Grid.Col span={6}>
									<Text fw={500}>Fee Percent: </Text>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fw={300}>{data?.feePercent || "-"}</Text>
								</Grid.Col>
							</Grid>
							<Grid mt={4}>
								<Grid.Col span={6}>
									<Text fw={500}>Special Price: </Text>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fw={300}>{data?.specialPrice || "-"}</Text>
								</Grid.Col>
							</Grid>
							<Grid mt={4}>
								<Grid.Col span={6}>
									<Text fw={500}>Shifting Fee Price: </Text>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fw={300}>{data?.shiftingFeePrice || "-"}</Text>
								</Grid.Col>
							</Grid>
							<Grid mt={4}>
								<Grid.Col span={6}>
									<Text fw={500}>Sqrt ft: </Text>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fw={300}>{data?.sqrFt || "-"}</Text>
								</Grid.Col>
							</Grid>
						</Box>
						<Box className={styles.inner}>
							<Title order={5}>Amenities</Title>
							<Amenities amenities={(data?.amenities as Amenity[]) || []} />
						</Box>
					</Grid.Col>
					<Grid.Col span={6}>
						<Title order={5}>Room Contacts</Title>
						<Contacts contacts={contacts} scrollHeight={400} />
					</Grid.Col>
				</Grid>
			</Box>
			<Box className={styles.inner}>
				<ScrollArea h={400}>
					<Images entity="room" entityId={roomId} />
					<Divider my={16} />
					<Videos entity="room" entityId={roomId} />
					<MediaFileInput entityId={roomId} />
				</ScrollArea>
			</Box>
			<Flex justify="flex-end">
				<Button color="blue" onClick={onClose}>
					Close
				</Button>
			</Flex>
		</>
	);
};
