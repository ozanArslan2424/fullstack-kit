import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

type DInput = Date | string;

export const timestamp = {
	to: {
		readable: (from: DInput, to?: DInput) => {
			const start = dayjs(from).format("MMM D, YYYY");
			const end = dayjs(to).format("MMM D, YYYY");
			if (to) {
				return `${start} - ${end}`;
			} else {
				return start;
			}
		},
		string: (date: DInput, format: string = "YYYY-MM-DD") => dayjs(date).format(format),
		date: (date: DInput) => dayjs(date).toDate(),
		utc: (date: DInput) => dayjs(date).utc().format(),
		iso: (date: DInput) => dayjs(date).toISOString(),
	},

	is: (date: DInput) => {
		return {
			valid: dayjs(date).isValid(),
			before: (compare: DInput) => dayjs(date).isBefore(compare),
			after: (compare: DInput) => dayjs(date).isAfter(compare),
			between: (start: DInput, end: DInput) => dayjs(date).isBetween(start, end),
			same: (compare: DInput) => dayjs(date).isSame(compare),
		};
	},
	day: (date?: DInput) => {
		return {
			date: dayjs(date).format("YYYY-MM-DD"),
			numberInMonth: dayjs(date).format("D"),
			numberInWeek: dayjs(date).format("d"),
			shortName: dayjs(date).format("ddd"),
			name: dayjs(date).format("dddd"),
			time: dayjs(date).format("HH:mm"),
			hour: dayjs(date).format("H"),
			minute: dayjs(date).format("m"),
			second: dayjs(date).format("s"),
			custom: (format: string) => dayjs(date).format(format),
		};
	},

	get: {
		weekday: (index: number, format: "long" | "short" = "long") => {
			const days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];
			const name = days[index];
			return format === "long" ? name : name.slice(0, 3);
		},
		timezones: () =>
			Intl.supportedValuesOf("timeZone")
				.map((timezone) => {
					const formatter = new Intl.DateTimeFormat("en", {
						timeZone: timezone,
						timeZoneName: "shortOffset",
					});
					const parts = formatter.formatToParts(new Date());
					const offset = parts.find((part) => part.type === "timeZoneName")?.value || "";
					const modifiedOffset = offset === "GMT" ? "GMT+0" : offset;

					return {
						value: timezone,
						label: `(${modifiedOffset}) ${timezone.replace(/_/g, " ")}`,
						numericOffset: parseInt(offset.replace("GMT", "").replace("+", "") || "0"),
					};
				})
				.sort((a, b) => a.numericOffset - b.numericOffset),
	},

	new: {
		date: () => dayjs().toDate(),
		utc: () => dayjs().utc().format(),
		iso: () => dayjs().toISOString(),
	},
};
