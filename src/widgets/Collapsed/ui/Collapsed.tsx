import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "shared/constants";
import { ThemeSwitcher } from "shared/ui/ThemeSwitcher/ThemeSwitcher";
import { DropdownMenu } from "widgets/DropdownMenu";
import { Sidebar } from "widgets/Sidebar";

import { AppShell, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";

import Logo from "../../../app/assets/images/logo.svg";

interface PropsCollapse {
	children: React.ReactNode;
}

export const Layout = ({ children }: PropsCollapse) => {
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
	const [mobileOpened] = useDisclosure();

	return (
		<AppShell
			layout="alt"
			header={{ height: 70 }}
			footer={{ height: 70 }}
			navbar={{
				width: 230,
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened, desktop: !desktopOpened }
			}}
			aside={{ width: 50, breakpoint: "sm", collapsed: { desktop: false, mobile: true } }}
			padding="md"
		>
			<AppShell.Header
				display="flex"
				style={{ justifyContent: "space-between", alignItems: "center" }}
			>
				<Button onClick={toggleDesktop} visibleFrom="sm" variant="default">
					{desktopOpened ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftExpand />}
				</Button>

				<Group>
					<ThemeSwitcher />

					<DropdownMenu />
				</Group>
			</AppShell.Header>
			<AppShell.Navbar p="md">
				<Link to={ROUTES.HOME}>
					<img src={Logo} alt="logo" />
				</Link>
				<Sidebar />
			</AppShell.Navbar>
			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	);
};
