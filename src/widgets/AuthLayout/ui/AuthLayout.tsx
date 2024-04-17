import React, { FC } from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
	return <div>{children}</div>;
};
