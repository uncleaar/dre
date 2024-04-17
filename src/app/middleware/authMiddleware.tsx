import { useStateContext } from "app/providers/StateProvider/state";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getMeFn } from "shared/api/auth";
import { COOKIE_ACCESS_TOKEN } from "shared/constants";
import { getCookie } from "shared/utils";

import { useQuery } from "@tanstack/react-query";

type AuthMiddlewareProps = {
	children: React.ReactElement;
};

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
	const cookieToken = getCookie(COOKIE_ACCESS_TOKEN);
	const localStorageToken = localStorage.getItem(COOKIE_ACCESS_TOKEN)
	const token = cookieToken || localStorageToken || null
	const navigate = useNavigate();
	const stateContext = useStateContext();

	const query = useQuery(["authUser"], () => getMeFn(), {
		enabled: !!token,
		onSuccess: (data) => {
			stateContext.dispatch({ type: "SET_USER", payload: data });
		}
	});

	return children;
};

export default AuthMiddleware;
