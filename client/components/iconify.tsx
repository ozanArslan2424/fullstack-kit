import { colors, themeColors } from "@/lib/colors";
import type { IconifyIcon, IconifyIconOnLoad } from "@iconify/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { type ReactEventHandler } from "react";

type DefaultIconifyProps = {
	icon: IconifyIcon | string;
	inline?: boolean;
	size?: string | number;
	hFlip?: boolean;
	vFlip?: boolean;
	flip?: string;
	rotate?: number;
	onLoad?: (ReactEventHandler<SVGSVGElement> & IconifyIconOnLoad) | undefined;
};

type IconifyProps = DefaultIconifyProps &
	(
		| { color?: string; presetColor?: never; themeColor?: never }
		| { color?: never; presetColor?: never; themeColor?: keyof typeof themeColors }
		| {
				color?: never;
				presetColor?: { key: keyof typeof colors; shade?: keyof (typeof colors)[keyof typeof colors] };
				themeColor?: never;
		  }
	);

export function Iconify({
	icon,
	inline,
	size = 20,
	hFlip,
	vFlip,
	flip,
	rotate,
	onLoad,
	color,
	presetColor,
	themeColor,
}: IconifyProps) {
	const { resolvedTheme } = useTheme();

	const resolvedColor = themeColor
		? themeColors[themeColor][resolvedTheme as "light" | "dark"]
		: presetColor
			? colors[presetColor.key][presetColor.shade || 500]
			: color
				? color
				: undefined;

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
			color={resolvedColor}
			onLoad={onLoad}
		/>
	);
}
