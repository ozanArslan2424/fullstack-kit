import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";

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
			{resolvedTheme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
		</Button>
	);
}

export { ThemeSwitch };
