import { Meta } from "./meta";

export interface Videos {
	list: Video[];
	meta: Meta;
}

export interface Video {
	id: string;
	entityId: string;
	name: string;
	order: number;
	description: string;
	mimetype: string;
	fileSizeBytes: number;
	publicUrl: string;
	createdAt: string;
	updatedAt: string;
}
