import { InputHTMLAttributes, useEffect, useState } from "react";

import { Input } from "@mantine/core";

import styles from "./DebouncedInput.module.scss";

export const DebouncedInput = ({
	value: initialValue,
	onChange,
	debounce = 500,
	size,
	...props
}: {
	value: string | number;
	size?: string;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<div className={styles.input}>
			<Input
				size={size}
				width={190}
				{...props}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		</div>
	);
};
