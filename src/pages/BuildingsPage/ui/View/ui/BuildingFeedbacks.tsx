import React, { FC } from "react";

import { Box, List, ScrollArea, Text } from "@mantine/core";

import styles from "../BuildingView.module.scss";

interface BuildingFeedbacksProps {
	feedbacks: string[] | [];
}
export const BuildingFeedbacks: FC<BuildingFeedbacksProps> = ({ feedbacks }) => {
	return (
		<Box className={styles.box}>
			<ScrollArea h={600}>
				{!feedbacks.length ? (
					<Text>There are no feedbacks yet.</Text>
				) : (
					<List>
						{feedbacks.map((item: string, i: number) => (
							<List.Item key={i}>
								<Box className={styles.box}>
									<Text>{item}</Text>
								</Box>
							</List.Item>
						))}
					</List>
				)}
			</ScrollArea>
		</Box>
	);
};
