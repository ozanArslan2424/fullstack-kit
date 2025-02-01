import { z } from "zod";
import { Button } from "@/components/button";
import { buttonStyles } from "@/components/button/button-styles";
import { ErrorMessage, Label } from "@/components/fields/label";
import { FieldProvider } from "@/components/fields/provider";
import { RadioGroup, RadioItem } from "@/components/fields/radio";
import { Form } from "@/components/form";
import { Link } from "@/components/link";
import { clientRoutePaths } from "@/config/route-gen";
import { useForm } from "@/hooks/use-form";

export function LandingPage() {
	const form = useForm({
		schema: z.object({
			radio: z.string(),
		}),
		defaultValues: {
			radio: "text",
		},
	});

	const handleSubmit = (values: any) => {
		console.log(values);
	};

	return (
		<div className="space-y-4 p-24">
			<h1>Hello from kit!</h1>

			<div className="mx-auto w-max max-w-md border p-8">
				<Form form={form} onSubmit={handleSubmit}>
					<FieldProvider id="textId" name="text">
						<Label>Text</Label>
						<RadioGroup name="radio">
							<RadioItem value="text">Text</RadioItem>
							<RadioItem value="password">Password</RadioItem>
							<RadioItem value="textarea">Textarea</RadioItem>
						</RadioGroup>
						<ErrorMessage />
					</FieldProvider>

					<Button type="submit">submit</Button>
				</Form>
			</div>

			<form
				className="w-max space-y-4 border p-4"
				onSubmit={(e) => {
					e.preventDefault();
					const formdata = new FormData(e.currentTarget);
					const data = Object.fromEntries(formdata.entries());
					console.log(data);
				}}
			>
				<RadioGroup name="test" defaultValue="one">
					<RadioItem id="one" value="one">
						One
					</RadioItem>
					<RadioItem id="two" value="two">
						Two
					</RadioItem>
					<RadioItem id="three" value="three" disabled>
						Three
					</RadioItem>
				</RadioGroup>

				<Button type="submit">submit</Button>
			</form>

			<div className="flex flex-col gap-2">
				{clientRoutePaths.map((path) => (
					<Link key={path} to={path} className={buttonStyles({ className: "w-max" })}>
						{path}
					</Link>
				))}
			</div>
		</div>
	);
}
