import { Button } from "@/components/button";
import { DefaultDialog } from "@/components/dialog/default";
import { Field } from "@/components/fields";
import { Form } from "@/components/form";
import { Iconify } from "@/components/iconify";
import { useForm } from "@/hooks/use-form";
import { useState } from "react";
import { z } from "zod";

const issueSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be between 3 and 100 characters." })
		.max(100, { message: "Title must be between 3 and 100 characters." }),
	content: z
		.string()
		.min(10, { message: "Issue content must be between 3 and 500 characters." })
		.max(500, { message: "Issue content must be between 3 and 500 characters." }),
});

type IssueFormValues = z.infer<typeof issueSchema>;

export function IssueForm() {
	const [open, setOpen] = useState(false);

	const form = useForm({
		schema: issueSchema,
		defaultValues: {
			title: "",
			content: "",
		},
	});

	function handleSubmit(values: IssueFormValues) {
		console.log(values);
	}

	return (
		<DefaultDialog
			open={open}
			onOpenChange={setOpen}
			title="New Issue"
			description="Submit a new issue to the bulletin board."
			trigger={
				<Button>
					<Iconify icon="lucide:plus" />
					New Issue
				</Button>
			}
		>
			<Form form={form} onSubmit={handleSubmit}>
				<Field.Provider id="title" name="title">
					<Field.Label>Title</Field.Label>
					<Field.Input type="text" />
					<Field.ErrorMessage />
				</Field.Provider>

				<Field.Provider id="content" name="content">
					<Field.Label>Title</Field.Label>
					<Field.Textarea resize="auto" />
					<Field.ErrorMessage />
				</Field.Provider>
				<Button type="submit">Submit Issue</Button>
			</Form>
		</DefaultDialog>
	);
}
