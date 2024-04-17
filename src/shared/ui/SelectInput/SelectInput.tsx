import { FC } from "react";

import { rem, Select } from "@mantine/core";

type SizeType = "xs" | "sm" | "md" | "lg" | "xl";

interface SelectOption {
	label: string;
	value: string;
}

interface SelectProps {
	onChange: (value: string | null) => void;
	onBlur: () => void;
	value?: string;
	icon?: React.ReactNode;
	data: SelectOption[];
	radius?: SizeType;
	size?: SizeType;
	placeholder?: string;
	variant?: "default" | "filled" | "unstyled";
	width?: any;
	error?: string;
	type?: string;
}

export const SelectInput: FC<SelectProps> = ({
	onChange,
	onBlur,
	icon,
	size = "md",
	radius = "md",
	variant = "filled",
	error,
	data,
	width = 300,
	type,
	placeholder,
	value
}) => {
	return (
		<Select
			variant={variant}
			onChange={onChange}
			description={placeholder}
			error={error}
			type={type}
			value={value}
			onBlur={onBlur}
			style={{ width }}
			data={data}
			radius={radius}
			size={size}
			leftSection={icon}
			placeholder={placeholder}
		/>
	);
};
