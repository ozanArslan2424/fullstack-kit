/**
 * Modified from the original source code to fit the application
 * Source: {@link: https://github.com/hasanharman/form-builder/blob/main/components/ui/datetime-picker.tsx}
 * Date time picker Docs: {@link: https://shadcn-extension.vercel.app/docs/otp-input}
 * Timescape Docs: {@link: https://github.com/dan-lee/timescape?tab=readme-ov-file}
 */
import { CalendarIcon } from "lucide-react";
import { ComponentProps, Fragment, useCallback } from "react";
import { type Options, useTimescape } from "timescape/react";
import { cn } from "@/lib/cn";
import { timestamp } from "@/lib/timestamp";
import { useField } from "./field";
import { inputStyles } from "./input";

type DateFormat = "days" | "months" | "years";
type TimeFormat = "hours" | "minutes" | "seconds" | "am/pm";

type DateTimeArray<T extends DateFormat | TimeFormat> = T[];
type DateTimeFormatDefaults = [DateTimeArray<DateFormat>, DateTimeArray<TimeFormat>];

type InputPlaceholders = Record<DateFormat | TimeFormat, string>;

type DateTimeInput = {
	value?: Date;
	format?: DateTimeFormatDefaults;
	placeholders?: InputPlaceholders;
	onChange?: Options["onChangeDate"];
	dtOptions?: Options;
	className?: string;
};

export function DatetimePicker(props: DateTimeInput) {
	const {
		value = new Date(),
		format = [
			["days", "months", "years"],
			["hours", "minutes"],
		],
		placeholders = {
			months: "MM",
			days: "DD",
			years: "YYYY",
			hours: "HH",
			minutes: "MM",
			seconds: "SS",
			"am/pm": "AM/PM",
		},
		dtOptions,
		onChange,
		className,
	} = props;

	const { register, errors, id, name, setValue } = useField();

	const onChangeDate = useCallback(
		(nextDate: Date | undefined) => {
			if (!nextDate) return;
			onChange?.(nextDate);

			const fixed = timestamp.to.string(nextDate.toISOString(), "YYYY-MM-DDTHH:mm:ss");

			setValue(name, fixed);
		},
		[onChange],
	);

	const timescape = useTimescape({ date: value, onChangeDate, ...dtOptions });

	const formatHasDate = format[0].length > 0;
	const formatHasTime = format[1].length > 0;
	const rootProps = timescape.getRootProps() as ComponentProps<"div">;

	const groupInputStyles = (unit: DateFormat | TimeFormat) =>
		inputStyles({
			className: cn(
				"focus:bg-foreground/20 box-content inline h-fit min-w-8 select-none rounded-sm border-none p-1 text-center tabular-nums caret-transparent outline-none focus-visible:outline-none focus-visible:ring-0",
				unit === "years" && "min-w-10",
				unit === "am/pm" && "bg-foreground/15",
			),
		});

	return (
		<div
			className={inputStyles({
				className: cn(
					"selection:text-foreground w-fit gap-1.5 py-2.5 pl-3 pr-1.5 selection:bg-transparent",
					className,
				),
			})}
			{...rootProps}
		>
			<input type="datetime-local" {...register(name)} id={id} className="hidden" />

			<CalendarIcon size={18} />

			{!!format?.length &&
				format.map((group, groupIndex) => (
					<Fragment key={groupIndex === 0 ? "dates" : "times"}>
						{!!group.length &&
							group.map((unit, unitIndex) => (
								<Fragment key={unit}>
									<input
										className={groupInputStyles(unit)}
										{...timescape.getInputProps(unit)}
										placeholder={placeholders[unit]}
									/>

									{unitIndex < group.length - 1 && (
										<span className="text-muted-foreground text-xs">
											{groupIndex === 0 ? "/" : ":"}
										</span>
									)}
								</Fragment>
							))}

						{format[1]?.length && !groupIndex && (
							<span className="text-muted-foreground text-xl opacity-30">|</span>
						)}
					</Fragment>
				))}
		</div>
	);
}
