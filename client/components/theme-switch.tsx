import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Iconify } from "./iconify";

function ThemeSwitch() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, resolvedTheme } = useTheme();

	useEffect(() => setMounted(true), []);

	function toggleTheme() {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}

	if (!mounted) return <Button size="icon" type="button" disabled />;

	return (
		<Button size="icon" onClick={toggleTheme}>
			{resolvedTheme === "dark" ? <Iconify icon="line-md:sunny" /> : <Iconify icon="line-md:moon" />}
		</Button>
	);
}

export { ThemeSwitch };
