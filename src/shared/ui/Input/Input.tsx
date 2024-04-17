import React, { ChangeEvent, FC, FocusEvent, forwardRef, ReactNode } from "react";

import { Textarea, TextareaProps, TextInput, TextInputProps } from "@mantine/core";

type SizeType = "xs" | "sm" | "md" | "lg" | "xl";

interface CustomInputProps {
	onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	value?: string | number;
	icon?: ReactNode;
	radius?: SizeType;
	size?: SizeType;
	description?: string;
	placeholder?: string;
	variant?: "default" | "filled" | "unstyled";
	error?: string;
	className?: string;
	width?: any;
	type?: "text" | "number" | "password";
	component?: "input" | "textarea" | "numberInput";
}

type InputProps = CustomInputProps &
	Omit<TextInputProps, keyof CustomInputProps> &
	Omit<TextareaProps, keyof CustomInputProps>;

export const Input: FC<InputProps> = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
	(
		{
			onChange,
			onBlur,
			description,
			value,
			size = "md",
			type,
			radius = "md",
			variant = "filled",
			error,
			width = 300,
			placeholder,
			icon,
			className,
			component = "input",
			...props
		},
		ref
	) => {
		const Component = component === "input" ? TextInput : Textarea;

		return (
			<Component
				type={type}
				variant={variant}
				onChange={onChange}
				onBlur={onBlur}
				value={value}
				description={placeholder}
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
	}
);

Input.displayName = "Input";
