import { FC } from "react";

import { Button, Flex, Modal, Text } from "@mantine/core";

import styles from "./DeleteModal.module.scss";

interface DeleteModalProps {
	opened: boolean;
	loading: boolean;
	onClose: () => void;
	onDelete: () => void;
}

export const DeleteModal: FC<DeleteModalProps> = ({ opened, onClose, loading, onDelete }) => {
	return (
		<Modal opened={opened} onClose={onClose} centered size="sm">
			<Text className={styles.text}>Are you sure you want to delete?</Text>
			<Flex justify="space-between">
				<Button color="red" onClick={onClose}>
					Cancel
				</Button>
				<Button color="green" onClick={onDelete} loading={loading}>
					Confirm
				</Button>
			</Flex>
		</Modal>
	);
};
