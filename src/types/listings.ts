import { Building } from "./building.ts";
import { Meta } from "./meta";
import { Room } from "./rooms";
import { Unit } from "./unit";
import { UserRoles } from "./user.ts";

export interface ListingList {
	list: Listing[];
	meta: Meta;
}

interface User {
	id: string;
	email: string;
	passwordSalt?: string;
	md5PasswordHash?: string;
	firstName: string;
	lastName: string;
	role: keyof typeof UserRoles;
	permissionsSet: string;
	isBanned: boolean;
	banReason: string;
	lastLogin: string;
	lastAction: string;
	deletedAt: string;
	deletedBy: string;
	createdAt: string;
}

export interface Listing {
	id: string;
	humanReadableId: string;
	createdBy: User[];
	entities: string[];
	status: string;
	buildings: Building[];
	units: Unit[];
	rooms: Room[];
	notes: any[];
	createdAt: string;
	updatedAt: string;
}
