import { create } from "zustand";

import { Listing } from "../../../types/listings.ts";

export interface ListingState {
	listing: Listing | null;
	setListingData: (data: Listing) => void;
}

const useListingStore = create<ListingState>((set) => ({
	listing: null,
	setListingData: (data) => set({ listing: data })
}));

export default useListingStore;
