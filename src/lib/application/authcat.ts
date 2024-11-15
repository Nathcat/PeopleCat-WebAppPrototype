import { env } from "$env/dynamic/public";
import * as cookie from "cookie";

export const get_cookie = () => cookie.parse(document.cookie)["AuthCat-SSO"];

export async function login(username: string, password: string) {
	const body = new FormData();
	body.set("username", username);
	body.set("password", password);

	const response = await fetch(`${env.PUBLIC_AUTHCAT_URL}/try-login.php`, {
		credentials: "include",
		method: "POST",
		mode: "cors",
		body,
	});

	if (!response.ok) return;
	const json = await response.json();
	if (json.status == "fail") return;
}
