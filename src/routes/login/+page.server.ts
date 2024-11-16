import { env } from "$env/dynamic/public";
import { error } from "@sveltejs/kit";
import * as cookie from "cookie";

export const actions = {
	default: async ({ request, fetch, cookies }) => {
		const body = await request.formData();

		const r = await fetch(`${env.PUBLIC_AUTHCAT_URL}/try-login.php`, {
			method: "POST",
			body,
		});

		if (!r.ok) error(500, "AuthCat response was not ok");
		const data = await r.json().catch(() => error(500, "Could not parse AuthCat response"));
		if (data.status == "fail") error(500, data.message);

		const session = r.headers
			.getSetCookie()
			.map((c) => cookie.parse(c)["AuthCat-SSO"])
			.find((c) => c !== undefined);

		if (session) cookies.set("AuthCat-SSO", session, { path: "/", httpOnly: false });
		else error(500, "Could not find AuthCat session token");
		return session;
	},
};
