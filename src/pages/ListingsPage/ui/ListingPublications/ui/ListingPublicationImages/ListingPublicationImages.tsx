import React, { FC, useEffect, useMemo, useState } from "react";
import { getPhotos } from "shared/api/photos";
import usePublicationStore from "shared/stores/publications/usePublicationStore";

import { Accordion, AccordionItem, AccordionPanel, Flex, Image } from "@mantine/core";
import { useQueries } from "@tanstack/react-query";

import styles from "./ListingPublicationImages.module.scss";

export const ListingPublicationImages: FC = () => {
	const { buildings, units, rooms, photos, setPublicationStoreData } = usePublicationStore();
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
				queryKey: ["photos", item],
				queryFn: async () => await getPhotos(item, {}),
				enabled: !!item,
				staleTime: Infinity
			})) ?? []
	});

	const photosData = useMemo(() => {
		const img: any[] = [];
		if (result) {
			result.forEach((ph) => {
				if (ph?.data?.list.length) {
					img.push(...ph.data.list);
				}
			});
		}
		return img;
	}, [result]);

	const onImageClick = (id: string) => {
		let result = [];
		if (photos.includes(id)) {
			result = photos.filter((item) => item !== id);
		} else {
			result = photos.concat(id);
		}
		setPublicationStoreData({ photos: result });
	};

	return (
		<Accordion defaultValue="data">
			<AccordionItem value="data">
				<Accordion.Control>Images</Accordion.Control>
				<AccordionPanel>
					<Flex wrap="wrap" gap={16}>
						{photosData.length
							? photosData.map((img) => {
									return (
										<Image
											className={photos.includes(img.id) ? styles.selected_img : ""}
											onClick={() => onImageClick(img.id)}
											key={img.publicUrl}
											radius={10}
											h={150}
											w="auto"
											mb={8}
											src={img.publicUrl}
											style={{ cursor: "pointer" }}
										/>
									);
								})
							: null}
					</Flex>
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	);
};
