import React, { ChangeEvent, FC, FocusEvent, ReactNode } from "react";
import { IMaskInput } from "react-imask";

import { Input } from "@mantine/core";

type SizeType = "xs" | "sm" | "md" | "lg" | "xl";

interface CustomInputProps {
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
	value?: string;
	icon?: ReactNode;
	radius?: SizeType;
	size?: SizeType;
	placeholder?: string;
	variant: "default" | "filled" | "unstyled";
	error?: string;
	className?: string;
	width?: number;
	type?: string;
}

export const PhoneInput: FC<CustomInputProps> = ({
	onChange,
	onBlur,
	value,
	size = "lg",
	type,
	radius = "md",
	variant = "filled",
	error,
	width = 300,
	placeholder,
	icon,
	className,
	...props
}) => {
	return (
		<Input
			type={type}
			variant={variant}
			component={IMaskInput}
			mask="+1 (000) 000-00-00"
			onChange={onChange}
			onBlur={onBlur}
			value={value}
			error={error}
			className={className}
			radius={radius}
			size={size}
			leftSection={icon}
			placeholder={placeholder}
			style={{ width }}
			{...props}
		/>
	);
};
