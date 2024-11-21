import { env } from "$env/dynamic/public";

export async function fetch_user(id: number) {
	const body = JSON.stringify({ id });

	const { data } = await ac_fetch("sso/user-search.php", {
		headers: { "Content-Type": "application/json" },
		method: "POST",
		body,
	});

	return data.results[id];
}

export async function ac_fetch(endpoint: string, init?: RequestInit) {
	const response = await fetch(new URL(endpoint, env.PUBLIC_AUTHCAT_URL), init);

	if (!response.ok) throw new Error("AuthCat response was not ok");
	const data = await response.json().catch(() => {
		throw new Error("Could not parse AuthCat response");
	});

	if (data.status == "fail") throw new Error(data.message);
	return { data, response };
}
