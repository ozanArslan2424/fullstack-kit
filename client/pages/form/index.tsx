import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ComponentProps, createContext, useContext, useState } from "react";
import {
	FieldErrors,
	FieldValues,
	FormProvider,
	UseFormRegister,
	useForm,
	useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { useFieldId } from "@/hooks/use-field-id";
import { cn } from "@/lib/cn";

const schema = z.object({
	text: z.string().min(1, "ashdjashdjhasjd"),
	email: z.string().email(),
	search: z.string(),
	password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function FormTestPage() {
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
	});
	return (
		<div className="px-8 py-4">
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(() => {})} className="flex flex-col gap-4">
					{/* <TextInput name="text" type="text" /> */}
					<Field id="text" name="text">
						<Label>Text</Label>
						<TestTextInput type="text" />
						<ErrorMessage />
					</Field>
					<TextInput name="email" type="email" />
					<TextInput name="search" type="search" />
					<PasswordInput name="password" />
					<button type="submit" className="cursor-pointer">
						test
					</button>
				</form>
			</FormProvider>
		</div>
	);
}

type DefaultInputProps = Omit<ComponentProps<"input">, "name" | "type"> & { name: string };
type TextInputTypes = "text" | "email" | "search" | "url";
type TextInputProps = DefaultInputProps & { type: TextInputTypes };

function TextInput({ id, name, className, type, ...rest }: TextInputProps) {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	const genId = useFieldId(name);
	return (
		<input
			{...rest}
			{...register(name)}
			id={id || genId}
			type={type}
			className={cn(
				"bg-background text-foreground border-primary/20 rounded-lg border px-3 py-1.5 transition",
				"hover:border-primary/50",
				"focus-visible:border-primary focus-visible:outline-none",
				"disabled:border-muted disabled:text-muted-foreground disabled:hover:border-muted disabled:bg-muted/20 disabled:cursor-not-allowed",
				errors[name] && "border-error focus-visible:border-warning",
				className,
			)}
		/>
	);
}

function PasswordInput({ id, name, className, ...rest }: DefaultInputProps) {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	const genId = useFieldId(name);

	const [visible, setVisible] = useState(false);

	function changeVisible() {
		setVisible(true);
		setTimeout(() => {
			setVisible(false);
		}, 1000);
	}

	return (
		<div
			className={cn(
				"bg-background text-foreground border-primary/20 rounded-lg border transition",
				"hover:border-primary/50",
				"focus-within:hover:border-primary focus-within:border-primary focus-within:outline-none",
				"disabled:border-muted disabled:text-muted-foreground disabled:hover:border-muted disabled:bg-muted/20 disabled:cursor-not-allowed",
				"flex items-center gap-2",
				errors[name] &&
					"border-error focus-within:border-warning focus-within:hover:border-warning",
				className,
			)}
		>
			<input
				{...rest}
				{...register(name)}
				id={id || genId}
				type={visible ? "text" : "password"}
				className="flex-1 rounded-lg px-3 py-1.5 focus-visible:outline-none"
			/>
			{visible ? (
				<button type="button" className="mr-1.5 aspect-square rounded-lg p-1.5" disabled>
					<EyeOffIcon size={20} />
				</button>
			) : (
				<button
					type="button"
					className="focus-visible:bg-secondary/30 mr-1.5 aspect-square rounded-lg p-1.5 focus-visible:outline-none"
					onClick={changeVisible}
				>
					<EyeIcon size={20} />
				</button>
			)}
		</div>
	);
}

const FieldContext = createContext<{
	id: string;
	name: string;
	register: UseFormRegister<FieldValues>;
	errors: FieldErrors<FieldValues>;
} | null>(null);

function useField() {
	const context = useContext(FieldContext);
	if (!context) {
		throw new Error("useField must be used within a Field");
	}
	return context;
}

function Field({
	id,
	name,
	children,
	className,
}: {
	id: string;
	name: string;
	children: React.ReactNode;
	className?: string;
}) {
	const formContext = useFormContext();
	const genId = useFieldId(name);

	if (!formContext) {
		throw new Error("Field must be used within a Form");
	}

	const {
		formState: { errors },
		register,
	} = formContext;

	return (
		<FieldContext.Provider value={{ id: id || genId, name, errors, register }}>
			<fieldset className={cn("w-full space-y-1", className)}>{children}</fieldset>
		</FieldContext.Provider>
	);
}

function textInputStyles({ className, isError }: { className?: string; isError?: boolean }) {
	return cn(
		"bg-background text-foreground border-primary/20 w-full rounded-lg border px-3 py-1.5 transition",
		"hover:border-primary/50",
		"focus-visible:border-primary focus-visible:outline-none",
		"disabled:border-muted disabled:text-muted-foreground disabled:hover:border-muted disabled:bg-muted/20 disabled:cursor-not-allowed",
		isError && "border-error focus-visible:border-warning",
		className,
	);
}

function TestTextInput({ className, type, ...rest }: Omit<ComponentProps<"input">, "name" | "id">) {
	const { name, id, register, errors } = useField();
	const error = errors[name]?.message?.toString();
	return (
		<input
			{...rest}
			{...register(name)}
			id={id}
			className={textInputStyles({ className, isError: !!error })}
		/>
	);
}

function ErrorMessage({ className, ...rest }: Omit<ComponentProps<"label">, "htmlFor">) {
	const { errors, name, id } = useField();
	const message = errors[name]?.message?.toString();

	if (!message) return null;

	return (
		<label htmlFor={id} className={cn("text-error block px-1 font-medium", className)}>
			{message}
		</label>
	);
}

function Label({ className, ...rest }: Omit<ComponentProps<"label">, "htmlFor">) {
	const { id } = useField();
	return (
		<label
			{...rest}
			htmlFor={id}
			className={cn("text-foreground block px-1 font-medium", className)}
		/>
	);
}
