import React, { useReducer } from "react";
import { COOKIE_ACCESS_TOKEN, COOKIE_USER_INFO } from "shared/constants";
import { getCookie } from "shared/utils";
import { User } from "types/user";

const LOGIN_ACTION = "SET_USER";
const SET_TOKEN_ACTION = "SET_TOKEN";
const LOGOUT_ACTION = "LOGOUT";

type State = {
	authUser: User;
	token: string | null;
};

type LoginAction = {
	type: typeof LOGIN_ACTION;
	payload: User | null;
};

type LogoutAction = {
	type: typeof LOGOUT_ACTION;
};

type SetTokenAction = {
	type: typeof SET_TOKEN_ACTION;
	payload: {
		accessToken: string | null;
		refreshToken: string | null;
	};
};

type Action = LoginAction | SetTokenAction | LogoutAction;

type Dispatch = (action: Action) => void;

const userInfo = getCookie(COOKIE_USER_INFO);
const cookieToken = getCookie(COOKIE_ACCESS_TOKEN);
const localStorageToken = localStorage.getItem(COOKIE_ACCESS_TOKEN);

const initialState: State = {
	authUser: userInfo ? JSON.parse(userInfo) : "",
	token: cookieToken || localStorageToken || null
};

type StateContextProviderProps = { children: React.ReactNode };

const StateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(
	undefined
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stateReducer = (state: State, action: Action): any => {
	switch (action.type) {
		case LOGIN_ACTION: {
			return {
				...state,
				authUser: action.payload as User | null
			};
		}

		case SET_TOKEN_ACTION: {
			return {
				...state,
				token: action.payload
			};
		}

		case LOGOUT_ACTION: {
			return {
				...state,
				authUser: null,
				token: localStorage.removeItem(COOKIE_ACCESS_TOKEN)
			};
		}
		default:
			throw new Error("Unknown  action");
	}
};

const StateContextProvider = ({ children }: StateContextProviderProps) => {
	const [state, dispatch] = useReducer(stateReducer, initialState);
	const value = { state, dispatch };
	return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};

const useStateContext = () => {
	const context = React.useContext(StateContext);

	if (context) {
		return context;
	}

	throw new Error(`useStateContext must be used within a StateContextProvider`);
};

export { StateContextProvider, useStateContext };
