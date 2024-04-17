import { Building } from "../../types/building";
import { Unit } from "../../types/unit";

export const transformUnitToFormValues = (data: Unit, building?: Building) => {
	return {
		unitName: data.unitName,
		unitRent: data.unitRent,
		buildingId: building
			? {
					value: building?.id,
					label: building?.name
				}
			: undefined,
		status: data?.status,
		unitNumber: data.unitNumber,
		floor: data.floor,
		haveKey: data.haveKey,
		forSale: data.forSale,
		forRent: data.forRent,
		useActualSqrFt: data.useActualSqrFt,
		hasLockbox: data.hasLockbox,
		availability: data.availability,
		shiftingFeePrice: data.shiftingFeePrice,
		...(data.specialPrice ? { specialPrice: Number(data.specialPrice) } : {}),
		specialPriceNote: data.specialPriceNote,
		feeType: data.feeType,
		...(data.feePercentage ? { feePercentage: Number(data.feePercentage) } : {}),
		notes: data.notes,
		lockboxType: data.lockboxType,
		lockboxCode: data.lockboxCode,
		keyArchiveNumber: data.keyArchiveNumber,
		altUnitNumber: data.altUnitNumber,
		SqrFt: data.SqrFt,
		amenities: data.amenities,
		contacts: data?.contacts,
		contactsData: data?.contactsData
	};
};
