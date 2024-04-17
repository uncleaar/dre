import { FC, JSX, useRef, useState } from "react";
import { Uploader } from "shared/utils/Uploader";

import { Button, FileInput, Flex, Progress } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

interface VideoInputProps {
	entityId: string;
	variant?: string;
	size?: string;
	radius?: string;
}
export const VideoInput: FC<VideoInputProps> = ({
	entityId,
	variant = "filled",
	size = "lg",
	radius = "xl"
}): JSX.Element => {
	const fileInputField = useRef<null>(null);
	const [file, setFile] = useState<any>(undefined);
	const [uploader, setUploader] = useState<any>(undefined);
	const [progress, setProgress] = useState(0);
	const queryClient = useQueryClient();

	const handleFileSelect = (file: File | null): void => {
		if (file) {
			setFile(file);
		}
	};

	const uploadFile = (): void => {
		if (file) {
			let percentage: any = undefined;

			const videoUploaderOptions = {
				fileName: file.name,
				file,
				mimetype: file.type,
				entityId
			};
			const uploader = new Uploader(videoUploaderOptions);
			setUploader(uploader);

			uploader
				.onProgress(({ percentage: newPercentage }: any) => {
					// to avoid the same percentage to be logged twice
					if (newPercentage !== percentage) {
						percentage = newPercentage;
						setProgress(percentage);
					}
				})
				.onSuccess(async () => {
					setProgress(0);
					setFile(undefined);
					await queryClient.invalidateQueries({ queryKey: ["videos", entityId] });
				})
				.onError((error: any) => {
					setFile(undefined);
				});

			uploader.start();
		}
	};

	const cancelUpload = () => {
		if (uploader) {
			uploader.abort();
			setFile(undefined);
		}
	};

	return (
		<Flex direction="column" align="center" gap={8}>
			<FileInput
				onChange={(file) => handleFileSelect(file)}
				ref={fileInputField}
				size={size}
				radius={radius}
				mb={8}
				value={file}
				variant={variant}
				w={300}
				label="Choose a video..."
				labelProps={{
					fz: 12,
					c: "gray"
				}}
			/>

			{progress > 0 && <Progress w={300} value={progress} />}
			<Flex gap={8}>
				<Button variant="outline" w={200} color="green" onClick={uploadFile} disabled={!file}>
					Upload
				</Button>
				{/*<Button variant="outline" w={200} onClick={cancelUpload} disabled={!file}>*/}
				{/*	Cancel*/}
				{/*</Button>*/}
			</Flex>
		</Flex>
	);
};
