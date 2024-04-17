import { FormValues } from "../../pages/UnitsPage/ui/CreateOrUpdate/CreateOrUpdateUnit.tsx";
import { Unit } from "../../types/unit.ts";

export const transformFormValuesToUnit = (formData: FormValues): Unit => {
	const mainFields = [
		"amenities",
		"unitName",
		"contacts",
		"address",
		"buildingId",
		"unitRent",
		"unitNumber",
		"floor",
		"haveKey",
		"forSale",
		"forRent",
		"useActualSqrFt",
		"hasLockbox",
		"availability",
		"shiftingFeePrice",
		"lockboxType",
		"lockboxCode",
		"altUnitNumber",
		"keyArchiveNumber",
		"specialPrice",
		"specialPriceNote",
		"feeType",
		"feePercentage",
		"notes",
		"SqrFt"
	];

	const transformedData: any = {};

	for (const field of mainFields) {
		if (field === "amenities") {
			transformedData[field] = formData[field]?.map((item: any) => item.id);
		} else {
			transformedData[field] = formData[field as keyof FormValues];
		}
	}

	if (formData.buildingId && formData.buildingId.value) {
		transformedData.buildingId = formData.buildingId.value;
	}

	return transformedData;
};
