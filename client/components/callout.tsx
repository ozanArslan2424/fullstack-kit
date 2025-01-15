import { ComponentProps } from "react";

type CalloutProps = ComponentProps<"div">;

export function Callout({ children, ...rest }: CalloutProps) {
	return (
		<div className="border-error rounded-lg border-2 px-6 py-3">
			<p className="text-lg font-semibold">{children}</p>
		</div>
	);
}
