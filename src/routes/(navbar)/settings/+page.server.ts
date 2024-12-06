import { logout } from "$lib/application/authcat.js";
import { error } from "@sveltejs/kit";

export const actions = {
	logout: async ({ cookies }) => {
		const cookie = cookies.get("AuthCat-SSO");
		if (!cookie) error(400, "'AuthCat-SSO' cookie missing");
		await logout(cookie).catch((e) => error(500, `${e}`));
	},
};
