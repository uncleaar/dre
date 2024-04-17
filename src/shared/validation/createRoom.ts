import { ContactTypes } from "shared/constants";
import { FeeTypes, RoomStatuses, RoomTypes } from "shared/constants/rooms/room-constants.ts";
import * as yup from "yup";

export const createRoomSchema = yup.object().shape({
	roomNumber: yup.number().min(0),
	roomType: yup.string().required().oneOf(Object.values(RoomTypes)),
	sqrFt: yup.number().min(0),
	availability: yup.date(),
	unitRent: yup.number().min(0),
	shiftingFeePrice: yup.string().min(0),
	specialPrice: yup.number().min(0),
	specialPriceNote: yup.string().min(0),
	feeType: yup.string().oneOf(Object.values(FeeTypes)),
	feePercent: yup.number().min(0),
	status: yup.string().oneOf(Object.values(RoomStatuses)),
	amenities: yup.array().of(
		yup.object().shape({
			id: yup.string(),
			category: yup.string(),
			name: yup.string(),
			notes: yup.string(),
			icon: yup.string(),
			label: yup.string(),
			value: yup.string()
		})
	),
	notes: yup.array().of(yup.string()),
	contacts: yup.array().of(
		yup.object().shape({
			contactId: yup.string(),
			contactType: yup.string().oneOf(Object.values(ContactTypes))
		})
	)
});
