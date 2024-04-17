import { Meta } from "./meta.ts";
import { User } from "./user.ts";

export interface Appointments {
	list: Appointment[];
	meta: Meta;
}

export interface Appointment {
	id: string;
	userId: string;
	reason?: string;
	date: string;
	type?: string;
	meetingPlace: string;
	notes?: string;
	user?: User[];
}
