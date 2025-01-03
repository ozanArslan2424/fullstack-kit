export async function htmlToString(templateName: string) {
	const absolutePath = `${import.meta.dir}/${templateName}.html`;
	const file = Bun.file(absolutePath);
	const text = await file.text();
	return text;
}
