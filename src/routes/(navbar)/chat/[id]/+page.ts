import { error } from "@sveltejs/kit";

export function load({ params }) {
	const chat = parseInt(params.id);
	if (isNaN(chat)) error(400, "Invalid Chat ID");
	return { chat };
}
