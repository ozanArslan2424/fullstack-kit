import { Icon } from "@iconify/react";
import type { IconifyIcon, IconifyIconOnLoad } from "@iconify/react";
import type { ReactEventHandler } from "react";

export function Iconify({
	icon,
	inline,
	size = 20,
	hFlip,
	vFlip,
	flip,
	rotate,
	color,
	onLoad,
}: {
	icon: IconifyIcon | string;
	inline?: boolean;
	size?: string | number;
	hFlip?: boolean;
	vFlip?: boolean;
	flip?: string;
	rotate?: number;
	color?: string;
	onLoad?: (ReactEventHandler<SVGSVGElement> & IconifyIconOnLoad) | undefined;
}) {
	return (
		<Icon
			icon={icon}
			inline={inline}
			width={size}
			height={size}
			hFlip={hFlip}
			vFlip={vFlip}
			flip={flip}
			rotate={rotate}
			color={color}
			onLoad={onLoad}
		/>
	);
}
