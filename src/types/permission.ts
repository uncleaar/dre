export type Permission = {
	name: string;
	description: string;
	isActive?: boolean;
};

export interface Permissions {
	name: string;
	description: string;
	isActive: boolean;
	permissions: PermissionName[];
}
export interface PermissionName {
	role: string;
	code: string;
	name: string;
	isAvailable: boolean;
}
