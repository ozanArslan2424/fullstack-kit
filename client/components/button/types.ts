import { ComponentProps } from "react";
import { buttonSizes, buttonVariants } from "./button-styles";

export type ButtonStyleProps = {
	variant?: keyof typeof buttonVariants;
	size?: keyof typeof buttonSizes;
	className?: string;
};

export type ButtonProps = {} & Omit<ComponentProps<"button">, "className"> & ButtonStyleProps;
