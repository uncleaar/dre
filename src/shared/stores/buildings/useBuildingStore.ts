import { create } from "zustand";

import { Photo } from "../../../types/photos.ts";
import { Video } from "../../../types/videos.ts";

export interface BuildingState {
	photos: {
		page: number;
		perPage: number;
		total: number;
		data: Photo[];
	};
	videos: {
		page: number;
		perPage: number;
		total: number;
		data: Video[];
	};

	setBuildingPhotosData: (
		data: Partial<{
			page: number;
			total: number;
			data: Photo[];
		}>
	) => void;
	setBuildingVideosData: (
		data: Partial<{
			page: number;
			total: number;
			data: Video[];
		}>
	) => void;
}

const useBuildingStore = create<BuildingState>((set) => ({
	photos: {
		page: 1,
		perPage: 10,
		total: 1,
		data: []
	},
	videos: {
		page: 1,
		perPage: 10,
		total: 1,
		data: []
	},
	setBuildingPhotosData: (data) =>
		set((state) => ({
			photos: {
				...state.photos,
				...data
			}
		})),
	setBuildingVideosData: (data) =>
		set((state) => ({
			videos: {
				...state.videos,
				...data
			}
		}))
}));

export default useBuildingStore;
