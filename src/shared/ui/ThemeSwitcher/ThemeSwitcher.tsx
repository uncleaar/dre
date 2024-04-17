import clsx from "clsx";
import { FaRegMoon as IconMoon } from "react-icons/fa";
import { MdOutlineWbSunny as IconSun } from "react-icons/md";

import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";

import classes from "./ThemeSwitcher.module.scss";

export const ThemeSwitcher = () => {
	const { setColorScheme } = useMantineColorScheme();
	const colorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

	return (
		<ActionIcon
			onClick={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
			variant="default"
			size="xl"
			aria-label="Toggle color scheme"
		>
			{colorScheme === "light" ? (
				<IconMoon className={clsx(classes.icon, classes.light)} />
			) : (
				<IconSun className={clsx(classes.icon, classes.dark)} />
			)}
		</ActionIcon>
	);
};
