import { FC, useCallback, useState } from "react";
import { addPhoto } from "shared/api/photos";

import { Button, FileInput, Flex } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ImageInputProps {
	entityId: string;
	variant?: string;
	size?: string;
	radius?: string;
}

export const ImageInput: FC<ImageInputProps> = ({
	entityId,
	variant = "filled",
	size = "lg",
	radius = "xl"
}) => {
	const [file, setFile] = useState<File | null>(null);
	const queryClient = useQueryClient();

	const { mutate, isLoading } = useMutation({
		mutationKey: ["photos"],
		mutationFn: async (file: File) => await addPhoto(entityId, file),
		onSuccess: async () => {
			setFile(null);
			await queryClient.invalidateQueries({ queryKey: ["photos", entityId] });
		}
	});

	const onClick = useCallback(() => {
		if (file) {
			mutate(file);
		}
	}, [file, mutate]);
	return (
		<Flex direction="column" align="center">
			<FileInput
				size={size}
				radius={radius}
				mb={16}
				value={file}
				variant={variant}
				w={300}
				onChange={(file) => setFile(file)}
				accept="image/png,image/jpeg"
				label="Choose an image..."
				labelProps={{
					fz: 12,
					c: "gray"
				}}
			/>
			<Button
				disabled={!file}
				color="green"
				w={200}
				variant="outline"
				onClick={onClick}
				loading={isLoading}
			>
				Save
			</Button>
		</Flex>
	);
};
