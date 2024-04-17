import dayjs from "dayjs";
import _ from "lodash";

import { Amenity } from "../../types/amenities";
import { FormValues } from "../../types/rooms";

export const transformFormValuesToRoom = (data: FormValues) => {
	let amenities: string[] = [];
	const { availability } = data;
	if (data.amenities && _.every(data.amenities, _.isObject)) {
		amenities = data.amenities.map((a: Amenity) => a.id);
	}
	return {
		...data,
		amenities,
		...(availability ? { availability: dayjs(availability).format() } : {})
	};
};
