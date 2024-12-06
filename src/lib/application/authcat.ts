import * as cookie from "cookie";
import type { User } from "./cache.svelte";
import { env } from "$env/dynamic/public";

/**
 * Checks if the current url is on a different origin than AuthCat
 * @returns `true` if the current url is CORS
 */
export const isCORS = () => !window.location.host.endsWith(env.PUBLIC_AUTHCAT_DOMAIN);

/**
 * Gets the AuthCat session cookie from the current browser
 * @returns The `AuthCat-SSO` cookie.
 */
export const getCookie = () => cookie.parse(document.cookie)["AuthCat-SSO"];

/**
 * Make a request to AuthCat
 * @param endpoint The AuthCat endpoint to request
 * @param init {@link RequestInit} to include
 * @returns The {@link Response} object
 */
export async function acFetch(endpoint: string, init?: RequestInit) {
	const response = await fetch(new URL(endpoint, env.PUBLIC_AUTHCAT_URL), init);
	if (!response.ok) throw new Error("AuthCat response was not ok");
	return response;
}

/**
 * Make a request to AuthCat and parse the response
 * @param endpoint The AuthCat endpoint to request
 * @param init {@link RequestInit} to include
 * @returns The parsed JSON and {@link Response} object.
 */
export async function acFetchJSON(endpoint: string, init?: RequestInit) {
	const response = await acFetch(endpoint, init);

	const data = await response.json().catch(() => {
		throw new Error("Could not parse AuthCat response");
	});

	if (data.status == "fail") throw new Error(data.message);
	return { data, response };
}

/**
 * Fetch User data from AuthCat
 * @param id The user ID to fetch
 * @returns The {@link User} object
 */
export async function fetchUser(id: number) {
	const body = JSON.stringify({ id });

	const { data } = await acFetchJSON("sso/user-search.php", {
		headers: { "Content-Type": "application/json" },
		method: "POST",
		body,
	});

	return data.results[id] as User;
}

export async function logout(cookie: string) {
	await acFetch("sso/logout.php", { headers: { Cookie: `AuthCat-SSO=${cookie}` } });
}
