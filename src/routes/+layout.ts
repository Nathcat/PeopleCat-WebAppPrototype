import { Application } from "$lib/application/application.svelte.js";

export async function load() {
	return {
		application: new Application(),
	};
}
