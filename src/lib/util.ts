/**
 * Call a server-side action
 * @param action The name of the action to call
 * @param body Optional body to include with the request
 */
export async function action(action: string, body?: BodyInit) {
	body ??= "";

	const response = await fetch(`${window.location}?/${action}`, {
		credentials: "include",
		method: "POST",
		body,
	});

	if (!response.ok) throw new Error("Response from server was not ok");
	const data = await response.json().catch(() => {
		throw new Error("Could not parse response from server");
	});

	if (data["type"] != "success") throw new Error("Server did not indicate success");
}
