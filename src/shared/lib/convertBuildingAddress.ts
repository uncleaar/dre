import { Building } from "../../types/building.ts";

export const convertBuildingAddress = ({ buildings }: { buildings: Building[] }): string => {
	if (!buildings.length) {
		return "-";
	}
	const buildingWithAddress = buildings.filter((item) => item.address);
	if (!buildingWithAddress.length) {
		return "-";
	}
	if (!buildingWithAddress[0].address.address) {
		return "-";
	}
	return `${buildingWithAddress[0].address.address}`;
};
