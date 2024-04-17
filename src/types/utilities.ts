import { Meta } from "./meta";

export interface Utilities {
	list: Utility[];
	meta: Meta;
}

export interface Utility {
	name: string;
	id: string;
	notes: string;
	icon: string;
}
