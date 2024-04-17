import { create } from "zustand";

import { Photo } from "../../../types/photos.ts";
import { Video } from "../../../types/videos.ts";

export interface UnitState {
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

	setUnitPhotosData: (
		data: Partial<{
			page: number;
			total: number;
			data: Photo[];
		}>
	) => void;
	setUnitVideosData: (
		data: Partial<{
			page: number;
			total: number;
			data: Video[];
		}>
	) => void;
}

const useUnitStore = create<UnitState>((set) => ({
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
	setUnitPhotosData: (data) =>
		set((state) => ({
			photos: {
				...state.photos,
				...data
			}
		})),
	setUnitVideosData: (data) =>
		set((state) => ({
			videos: {
				...state.videos,
				...data
			}
		}))
}));

export default useUnitStore;
