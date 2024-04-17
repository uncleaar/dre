import { useStateContext } from "app/providers/StateProvider/state";
import { useNavigate } from "react-router-dom";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN, ROUTES } from "shared/constants";
import { deleteCookie } from "shared/utils";
import { UserButton } from "widgets/UserButton";

import { Menu } from "@mantine/core";

export const DropdownMenu = () => {
	const navigate = useNavigate();
	const { dispatch, state } = useStateContext();

	const handleLogout = () => {
		dispatch({ type: "LOGOUT" });
		deleteCookie(COOKIE_ACCESS_TOKEN);
		window.localStorage.removeItem(COOKIE_REFRESH_TOKEN);
		navigate(ROUTES.LOGIN);
	};

	return (
		<Menu shadow="md" width={200} withArrow>
			<Menu.Target>
				<UserButton
					image="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
					name={state?.authUser?.firstName}
					email={state?.authUser?.email}
				/>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item onClick={handleLogout}>Logout</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};
