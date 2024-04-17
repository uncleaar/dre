import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getMeFn } from "shared/api/auth";
import { IS_AUTH_COOKIE } from "shared/constants";
import { getCookie } from "shared/utils";
import { User } from "types/user";

import { useQuery } from "@tanstack/react-query";

import { useStateContext } from "../StateProvider/state";

interface RequireUserProps {
	allowedRoles: string[];
	children: React.ReactNode;
}

export const RequireUser = ({ allowedRoles }: RequireUserProps) => {
	const isAuth = getCookie(IS_AUTH_COOKIE);
	const location = useLocation();
	const stateContext = useStateContext();

	const query = useQuery({
		queryKey: ["authUser"],
		queryFn: getMeFn,
		enabled: false,
		select: (data: User) => data
	});

	useEffect(() => {
		if (query.isSuccess) {
			stateContext.dispatch({ type: "SET_USER", payload: query.data });
		}
	}, []);

	const loading = query.isLoading || query.isFetching;

	if (loading) {
		return <p>loading</p>;
	}

	return (isAuth || query.data) && allowedRoles.includes(query.data?.role as string) ? (
		<Outlet />
	) : isAuth && query.data ? (
		<Navigate to="/unauthorized" state={{ from: location }} replace />
	) : (
		<Navigate to="/sign-in" state={{ from: location }} replace />
	);
};
