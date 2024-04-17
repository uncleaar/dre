import { CreateOrUpdateRoom } from "./ui/CreateOrUpdate/CreateOrUpdateRoom";
import { RoomView } from "./ui/View/RoomView";

export const roomModals = {
	view: {
		component: RoomView,
		size: "50%"
	},

	create: {
		component: CreateOrUpdateRoom,
		size: "50%"
	},

	update: {
		component: CreateOrUpdateRoom,
		size: "50%"
	}
};
