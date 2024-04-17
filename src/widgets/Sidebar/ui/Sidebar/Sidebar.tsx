import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "shared/constants";

import { Box, Collapse, NavLink } from "@mantine/core";
import {
	IconBuildingEstate,
	IconCalendarCheck,
	IconChevronDown,
	IconChevronRight,
	IconForbid,
	IconHome2,
	IconSettings,
	IconUsersGroup
} from "@tabler/icons-react";

import styles from "./Sidebar.module.scss";

const sidebarItems = [
	{ label: "Users", icon: IconUsersGroup, route: ROUTES.USERS },
	{ label: "Listings", icon: IconUsersGroup, route: ROUTES.LISTINGS },
	{ label: "Buildings", icon: IconHome2, route: ROUTES.BUILDINGS },
	{ label: "Units", icon: IconBuildingEstate, route: ROUTES.UNITS },
	{ label: "Permissions", icon: IconForbid, route: ROUTES.PERMISSIONS },
	{ label: "Appointments", icon: IconCalendarCheck, route: ROUTES.APPOINTMENTS },
	{
		label: "Settings",
		icon: IconSettings,
		route: null,
		subItems: [
			{ label: "Contacts", route: ROUTES.SETTINGS_CONTACTS },
			{ label: "Amenities", route: ROUTES.SETTINGS_AMENITIES },
			{ label: "Utilities", route: ROUTES.SETTINGS_UTILITIES }
		]
	}
];
export const Sidebar = () => {
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<ul>
			{sidebarItems.map((item) => (
				<li key={item.label}>
					<NavLink
						label={item.label}
						leftSection={<item.icon size="1rem" stroke={1.5} width={35} height={35} />}
						rightSection={
							item.subItems &&
							(settingsOpen ? <IconChevronDown size="1rem" /> : <IconChevronRight size="1rem" />)
						}
						to={item.route as any}
						onClick={item.subItems ? () => setSettingsOpen(!settingsOpen) : (null as any)}
						component={Link}
					/>
					{item?.subItems && (
						<Collapse in={settingsOpen}>
							<Box component="ul" className={styles.inner}>
								{item?.subItems.map((subItem) => (
									<li key={subItem.label}>
										<NavLink label={subItem.label} to={subItem.route} component={Link} />
									</li>
								))}
							</Box>
						</Collapse>
					)}
				</li>
			))}
		</ul>
	);
};
