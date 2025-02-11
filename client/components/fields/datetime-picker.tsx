/**
 * Modified from the original source code to fit the application
 * Source: {@link: https://github.com/hasanharman/form-builder/blob/main/components/ui/datetime-picker.tsx}
 * Date time picker Docs: {@link: https://shadcn-extension.vercel.app/docs/otp-input}
 * Timescape Docs: {@link: https://github.com/dan-lee/timescape?tab=readme-ov-file}
 */
import { timestamp } from "@/lib/timestamp";
import type { ComponentProps } from "react";
import { Fragment, useCallback, useState } from "react";
import { useTimescape } from "timescape/react";
import { Iconify } from "../iconify";
import { useField } from "./provider";
import { dateGroupInputStyles, datetimePickerStyles } from "./styles/datetime-picker-styles";
import type { DatetimeInputProps } from "./types";

export function DatetimePicker({
	id,
	name,
	isError,
	defaultValue,
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
	register,
}: DatetimeInputProps) {
	const fieldContext = useField();

	const fieldId = fieldContext?.id || id || "";
	const fieldName = fieldContext?.name || name || "";
	const fieldError = isError || !!fieldContext?.error;
	const fieldRegister = fieldContext ? fieldContext.register(fieldName) : undefined;

	const defVal = fieldContext?.defaultValues?.[fieldName] || defaultValue;

	const [internalState, setInternalState] = useState<string | undefined>(defVal);

	const onChangeDate = useCallback(
		(nextDate: Date | undefined) => {
			if (!nextDate) return;
			onChange?.(nextDate);
			const fixed = timestamp.to.string(nextDate.toISOString(), "YYYY-MM-DDTHH:mm:ss");
			setInternalState(fixed);
		},
		[onChange],
	);

	const timescape = useTimescape({ date: value, onChangeDate, ...dtOptions });

	return (
		<div
			className={datetimePickerStyles({ className, isError: fieldError })}
			{...(timescape.getRootProps() as ComponentProps<"div">)}
		>
			<input
				type="datetime-local"
				id={fieldId}
				name={fieldName}
				className="hidden"
				value={internalState}
				{...fieldRegister}
				readOnly
			/>

			<Iconify icon="lucide:calendar" />

			{!!format?.length &&
				format.map((group, groupIndex) => (
					<Fragment key={groupIndex === 0 ? "dates" : "times"}>
						{!!group.length &&
							group.map((unit, unitIndex) => (
								<Fragment key={unit}>
									<input
										className={dateGroupInputStyles(unit)}
										{...timescape.getInputProps(unit)}
										placeholder={placeholders[unit]}
									/>

									{unitIndex < group.length - 1 && (
										<span className="text-muted-foreground text-xs">{groupIndex === 0 ? "/" : ":"}</span>
									)}
								</Fragment>
							))}

						{format[1]?.length && !groupIndex && <span className="text-muted-foreground text-xl opacity-30">|</span>}
					</Fragment>
				))}
		</div>
	);
}
