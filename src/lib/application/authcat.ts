import { env } from "$env/dynamic/public";
import type { User } from "./cache.svelte";

/**
 * Fetch User data from AuthCat
 * @param id The user ID to fetch
 * @returns The {@link User} object
 */
export async function fetchUser(id: number) {
	const body = JSON.stringify({ id });

	const { data } = await acFetch("sso/user-search.php", {
		headers: { "Content-Type": "application/json" },
		method: "POST",
		body,
	});

	return data.results[id] as User;
}

/**
 * Make a request to AuthCat
 * @param endpoint The authcat endpoint to reqyes
 * @param init {@link RequestInit} to include
 * @returns The JSON response and request object
 */
export async function acFetch(endpoint: string, init?: RequestInit) {
	const response = await fetch(new URL(endpoint, env.PUBLIC_AUTHCAT_URL), init);

	if (!response.ok) throw new Error("AuthCat response was not ok");
	const data = await response.json().catch(() => {
		throw new Error("Could not parse AuthCat response");
	});

	if (data.status == "fail") throw new Error(data.message);
	return { data, response };
}
