import { create } from "zustand";

import { Building } from "../../../types/building";
import { Room } from "../../../types/rooms";
import { Unit } from "../../../types/unit";

interface StoreData {
	buildings: Building[];
	units: Unit[];
	rooms: Room[];
	photos: string[];
	videos: string[];
	selectedPubTab?: string;
}
export interface PublicationState {
	buildings: Building[];
	units: Unit[];
	rooms: Room[];
	photos: string[];
	videos: string[];
	selectedPubTab?: string;
	setSelectedPubTab: (data: string) => void;
	setPublicationStoreData: (data: Partial<PublicationState>) => void;
}

const usePublicationStore = create<PublicationState>((set) => ({
	buildings: [],
	units: [],
	rooms: [],
	photos: [],
	videos: [],
	setSelectedPubTab: (data) => set({ selectedPubTab: data }),
	setPublicationStoreData: (data) =>
		set((state) => ({
			...state,
			...data
		}))
}));

export default usePublicationStore;
