import dayjs from "dayjs";

import { Room } from "../../types/rooms";

export const transformRoomToFormValues = (data: Room) => {
	return {
		status: data.status,
		roomType: data.roomType,
		roomNumber: data.roomNumber,
		sqrFt: data.sqrFt,
		amenities: data.amenities,
		availability: data.availability ? dayjs(data.availability) : data.availability,
		unitRent: data.unitRent,
		shiftingFeePrice: data.shiftingFeePrice,
		specialPrice: data.specialPrice,
		specialPriceNote: data.specialPriceNote,
		feeType: data.feeType,
		feePercent: data.feePercent,
		contacts: data.contacts,
		contactsData: data?.contactsData,
		notes: data.notes
	};
};
