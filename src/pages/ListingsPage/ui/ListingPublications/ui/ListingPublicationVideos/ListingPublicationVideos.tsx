import React, { FC, useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { getVideos } from "shared/api/videos.ts";
import usePublicationStore from "shared/stores/publications/usePublicationStore.ts";

import { Accordion, AccordionItem, AccordionPanel, Flex, Image } from "@mantine/core";
import { useQueries } from "@tanstack/react-query";

import styles from "../../ListingPublications.module.scss";

export const ListingPublicationVideos: FC = () => {
	const { buildings, units, rooms, videos, setPublicationVideos } = usePublicationStore();
	const [entities, setEntities] = useState<string[]>([]);

	useEffect(() => {
		let entities: any[] = [];
		entities = entities.concat(buildings, units, rooms);
		entities = entities.map((item) => item.id);
		setEntities(entities);
	}, [buildings, units, rooms]);

	const result = useQueries({
		queries:
			entities?.map((item) => ({
				queryKey: ["videos", item],
				queryFn: async () => await getVideos(item, {}),
				enabled: !!item,
				staleTime: Infinity
			})) ?? []
	});

	const videosData = useMemo(() => {
		const videos: any[] = [];
		if (result) {
			result.forEach((ph) => {
				if (ph?.data?.list.length) {
					videos.push(...ph.data.list);
				}
			});
		}
		return videos;
	}, [result]);

	const onVideoClick = (id: string) => {
		let result = [];
		if (videos.includes(id)) {
			result = videos.filter((item) => item !== id);
		} else {
			result = videos.concat(id);
		}
		setPublicationVideos(result);
	};

	return (
		<Accordion defaultValue="data">
			<AccordionItem value="data">
				<Accordion.Control>Videos</Accordion.Control>
				<AccordionPanel>
					<Flex wrap="wrap" gap={16}>
						{videosData.length
							? videosData.map((video) => {
									return (
										<div
											className={videos.includes(video.id) ? styles.selected_video : ""}
											onClick={() => onVideoClick(video.id)}
											key={video.id}
										>
											<ReactPlayer
												controls={false}
												className={styles.react_player_cst}
												height={300}
												width="auto"
												url={video.publicUrl}
											/>
										</div>
									);
								})
							: null}
					</Flex>
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	);
};
