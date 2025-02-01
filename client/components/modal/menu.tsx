import { type ReactNode, createContext, useContext, useState } from "react";
import { cn } from "@/lib/cn";
import { buttonStyles } from "../button/button-styles";
import { ButtonProps } from "../button/types";
import { Link } from "../link";
import type { TypedNavLinkProps, TypedRegularLinkProps } from "../link";
import { Popover, PopoverSlot } from "./popover";

export type MenuLinkProps = TypedRegularLinkProps & { element: "link" };
export type MenuNavLinkProps = TypedNavLinkProps & { element: "nav-link" };
export type MenuButtonProps = ButtonProps & { element: "button" };

export type MenuItemProps = MenuLinkProps | MenuNavLinkProps | MenuButtonProps;

const MenuContext = createContext<{
	controls: [boolean, (open: boolean) => void];
} | null>(null);

function MenuProvider({
	children,
	controls,
}: {
	children: ReactNode;
	controls: [boolean, (open: boolean) => void];
}) {
	return <MenuContext.Provider value={{ controls }}>{children}</MenuContext.Provider>;
}

export function Menu({
	children,
	defaultOpen = false,
	controls,
}: {
	children: ReactNode;
	defaultOpen?: boolean;
	controls?: [boolean, (open: boolean) => void];
}) {
	const internalState = useState(defaultOpen);

	const open = controls ? controls[0] : internalState[0];
	const setOpen = controls ? controls[1] : internalState[1];

	return (
		<MenuProvider controls={internalState}>
			<Popover open={open} onOpenChange={setOpen} defaultOpen={defaultOpen}>
				{children}
			</Popover>
		</MenuProvider>
	);
}

export const MenuSlot = {
	Trigger: PopoverSlot.Trigger,
	Content: PopoverSlot.Content,
} as const;

export function MenuItem({ element, onClick, className, ...rest }: MenuItemProps) {
	const context = useContext(MenuContext);
	if (context === null) {
		throw new Error("MenuItem must be used within a Menu");
	}
	const setOpen = context.controls[1];

	const clickHandler = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent> &
			React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		setOpen(false);
		onClick?.(e);
	};

	const classes = cn(
		buttonStyles({
			size: "sm",
			variant: "primary",
			className: "w-full",
		}),
		className,
	);

	if (element === "link") {
		return (
			<Link
				{...(rest as TypedRegularLinkProps)}
				variant="regular"
				onClick={clickHandler}
				className={classes}
			/>
		);
	}

	if (element === "nav-link") {
		return (
			<Link
				{...(rest as TypedNavLinkProps)}
				variant="nav"
				onClick={clickHandler}
				className={classes}
			/>
		);
	}

	if (element === "button") {
		return (
			<button
				type="button"
				{...(rest as ButtonProps)}
				onClick={clickHandler}
				className={classes}
			/>
		);
	}
}
