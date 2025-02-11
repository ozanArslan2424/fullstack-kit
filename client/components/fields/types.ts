import type { ComponentProps, ReactNode } from "react";
import type { FieldValues, UseFormRegister } from "react-hook-form";
import type { Options } from "timescape/react";

export type FieldContextType = {
	id: string;
	name: string;
	error: string | undefined;
	register: UseFormRegister<FieldValues>;
	defaultValues?: Readonly<FieldValues>;
};

export type InputTypeOption =
	| "text"
	| "password"
	| "email"
	| "number"
	| "file"
	| "search"
	| "tel"
	| "url"
	| "color"
	| "date"
	| "time"
	| "datetime-local"
	| "month"
	| "week";

export type DefaultFieldProps = {
	id?: string;
	name?: string;
	isError?: boolean;
};

export type TextareaProps = Omit<ComponentProps<"textarea">, "id" | "name"> &
	DefaultFieldProps & {
		resize?: "none" | "both" | "vertical" | "horizontal" | "auto";
	};

export type InputProps = Omit<ComponentProps<"input">, "name" | "id" | "type"> &
	DefaultFieldProps & {
		type: InputTypeOption;
		startIcon?: ReactNode;
		endIcon?: ReactNode;
	};

export type DateFormat = "days" | "months" | "years";
export type TimeFormat = "hours" | "minutes" | "seconds" | "am/pm";

export type DateTimeArray<T extends DateFormat | TimeFormat> = T[];
export type DateTimeFormatDefaults = [DateTimeArray<DateFormat>, DateTimeArray<TimeFormat>];

export type InputPlaceholders = Record<DateFormat | TimeFormat, string>;

export type DatetimeInputProps = DefaultFieldProps & {
	value?: Date;
	defaultValue?: string;
	onChange?: Options["onChangeDate"];
	format?: DateTimeFormatDefaults;
	placeholders?: InputPlaceholders;
	dtOptions?: Options;
	className?: string;
	register?: ComponentProps<"input">;
};

export type DatetimeInputFieldProps = Omit<DatetimeInputProps, "id" | "name" | "defaultValue" | "isError">;

export type SelectProps = {
	options: { label: string; value: string }[];
	isError?: boolean;
} & ComponentProps<"select">;

export type SelectFieldProps = Omit<SelectProps, "name" | "id" | "isError">;

export type SelectStylesProps = {
	className?: string;
	isError?: boolean;
};

export type RadioContextProps = {
	name: string;
	selected: string | undefined;
	setSelected: (selected: string) => void;
	defaultValue?: string;
};

export type RadioGroupProps = {
	name: string;
	defaultValue?: string;
} & Omit<ComponentProps<"fieldset">, "defaultValue">;

export type RadioItemProps = DefaultFieldProps & {
	children?: ReactNode;
	value: string;
	disabled?: boolean;
	className?: string;
	wrapperClassName?: string;
};

export type SliderProps = Omit<ComponentProps<"input">, "type" | "id" | "name" | "min" | "max"> &
	DefaultFieldProps & {
		min: number;
		max: number;
	};
