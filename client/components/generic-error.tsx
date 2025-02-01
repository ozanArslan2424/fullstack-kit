import { getErrorMessage } from "@/lib/get-err-msg";

export function GenericError({ error }: { error: unknown }) {
	const message = getErrorMessage(error);
	return (
		<pre className="border-error w-max max-w-xl overflow-clip rounded-lg border-2 bg-green-900/10 p-8">
			<code>{message ?? JSON.stringify(error, null, 2)}</code>
		</pre>
	);
}
