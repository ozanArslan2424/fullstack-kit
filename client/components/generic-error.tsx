import { getErrorMessage } from "@/client/utils/get-err-msg";

export function GenericError({ error }: { error: unknown }) {
	return (
		<pre className="border-error w-max max-w-xl overflow-clip rounded-lg border-2 bg-green-900/10 p-8">
			<code>{getErrorMessage(error)}</code>
			<br />
			<code>{JSON.stringify(error, null, 2)}</code>
		</pre>
	);
}
