import { buttonStyles } from "@/components/button/button-styles";
import type { ButtonProps } from "./types";

export function Button({ variant = "outline", size = "md", className, ...rest }: ButtonProps) {
	return <button {...rest} className={buttonStyles({ variant, size, className })} />;
}
