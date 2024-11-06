import { Application } from "$lib/application.svelte.js";

export async function load() {
	return {
		application: new Application()
	};
}
