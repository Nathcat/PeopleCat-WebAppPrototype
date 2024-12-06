import { acFetchJSON } from "$lib/application/authcat.js";
import { error } from "@sveltejs/kit";
import * as cookie from "cookie";

export const actions = {
	default: async ({ request, cookies }) => {
		const body = await request.formData();

		const { response } = await acFetchJSON("sso/try-login.php", {
			method: "POST",
			body,
		}).catch((e) => error(500, `${e}`));

		const session = response.headers
			.getSetCookie()
			.map((c) => cookie.parse(c)["AuthCat-SSO"])
			.find((c) => c !== undefined);

		if (session) cookies.set("AuthCat-SSO", session, { path: "/", httpOnly: false });
		else error(500, "Could not find AuthCat session token");
		return session;
	},
};
