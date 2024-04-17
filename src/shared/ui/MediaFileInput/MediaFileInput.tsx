import { FC } from "react";
import { ImageInput } from "shared/ui/MediaFileInput/ImageInput";
import { VideoInput } from "shared/ui/MediaFileInput/VideoInput";

import { rem, Tabs } from "@mantine/core";
import { IconPhoto, IconVideo } from "@tabler/icons-react";

interface MediaFileInputProps {
	entityId: string;
}
export const MediaFileInput: FC<MediaFileInputProps> = ({ entityId }) => {
	const iconStyle = { width: rem(12), height: rem(12) };
	return (
		<Tabs defaultValue="image">
			<Tabs.List justify="center" mb={16}>
				<Tabs.Tab value="image" leftSection={<IconPhoto style={iconStyle} />}>
					Image
				</Tabs.Tab>
				<Tabs.Tab value="video" leftSection={<IconVideo style={iconStyle} />}>
					Video
				</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="image">
				<ImageInput entityId={entityId} />
			</Tabs.Panel>

			<Tabs.Panel value="video">
				<VideoInput entityId={entityId} />
			</Tabs.Panel>
		</Tabs>
	);
};
