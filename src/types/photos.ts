import { Meta } from "./meta";

export interface Photos {
	list: Photo[];
	meta: Meta;
}

export interface Photo {
	id: string;
	entityId: string;
	description: string;
	mimetype: string;
	name: string;
	publicUrl: string;
	createdAt: string;
	updatedAt: string;
	order: number;
	fileSizeBytes: number;
}
