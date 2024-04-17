import { create } from "zustand";

import { Photo } from "../../../types/photos.ts";
import { Video } from "../../../types/videos.ts";

export interface RoomState {
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
	setRoomPhotosData: (
		data: Partial<{
			page: number;
			total: number;
			data: Photo[];
		}>
	) => void;
	setRoomVideosData: (
		data: Partial<{
			page: number;
			total: number;
			data: Video[];
		}>
	) => void;
}

const useRoomStore = create<RoomState>((set) => ({
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
	setRoomPhotosData: (data) =>
		set((state) => ({
			photos: {
				...state.photos,
				...data
			}
		})),
	setRoomVideosData: (data) =>
		set((state) => ({
			videos: {
				...state.videos,
				...data
			}
		}))
}));

export default useRoomStore;
