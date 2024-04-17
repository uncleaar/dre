import { TouchEvent, useState, WheelEvent } from "react";

export const useScroll = (initialPage = 1) => {
	const [page, setPage] = useState<number>(initialPage);

	const onMenuScrollToBottom = (event: any) => {
		if (event.isTrusted) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	// TODO: type ts for event WheelEvent | TouchEvent
	const onMenuScrollToTop = (event: any) => {
		if (event.isTrusted && page > 1) {
			setPage((prevPage) => prevPage - 1);
		}
	};

	return {
		page,
		onMenuScrollToBottom,
		onMenuScrollToTop
	};
};
