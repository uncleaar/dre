import React, { FC, useEffect, useState } from "react";

import { RangeSlider } from "@mantine/core";

interface DebouncedRangeSliderProps {
	min: number;
	max: number;
	value: any;
	onChange: any;
	debounce: any;
}
export const DebouncedRangeSlider: FC<DebouncedRangeSliderProps> = ({
	min,
	max,
	value,
	onChange,
	debounce = 500
}) => {
	const [sliderValue, setSliderValue] = useState(value);

	useEffect(() => {
		setSliderValue(value);
	}, [value]);

	useEffect(() => {
		const handler = setTimeout(() => onChange(sliderValue), debounce);
		return () => clearTimeout(handler);
	}, [sliderValue, onChange, debounce]);

	return (
		<RangeSlider
			min={min}
			max={max}
			value={sliderValue}
			onChange={setSliderValue}
			marks={[
				{ value: min, label: `${min}` },
				{ value: max, label: `${max}` }
			]}
		/>
	);
};
