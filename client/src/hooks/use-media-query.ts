import { useEffect, useState } from "react";

const BREAKPOINTS = {
	small: 640,
	mobile: 768,
	large: 1024,
	xLarge: 1280,
	xxLarge: 1536,
};

export function useMediaQuery(breakpoint: keyof typeof BREAKPOINTS) {
	const [underBreakpoint, setUnderBreakpoint] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`);
		const onChange = () => {
			setUnderBreakpoint(window.innerWidth < BREAKPOINTS[breakpoint]);
		};
		mql.addEventListener("change", onChange);
		setUnderBreakpoint(window.innerWidth < BREAKPOINTS[breakpoint]);
		return () => mql.removeEventListener("change", onChange);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return !!underBreakpoint;
}
