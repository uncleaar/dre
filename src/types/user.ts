import { Meta } from "./meta";

export interface ListUsers {
	list: User[];
	meta: Meta;
}

export interface User {
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	id: string;
	createdAt?: string;
	password?: string;
	updatedAt?: string;
	permissionsSet?: string;
}

export const UserRoles = {
	superAdmin: "superAdmin",
	supportStaff: "supportStaff",
	user: "user"
} as const;
