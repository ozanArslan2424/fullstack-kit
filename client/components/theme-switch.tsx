import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeSwitch() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, resolvedTheme } = useTheme();

	useEffect(() => setMounted(true), []);

	function toggleTheme() {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}

	if (!mounted) return <button type="button" disabled />;

	return (
		<button onClick={toggleTheme}>
			{resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
		</button>
	);
}

export { ThemeSwitch };
