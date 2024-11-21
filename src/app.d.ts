// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Application } from "$lib/application/application.svelte";

// for information about these interfaces
declare global {
	namespace App {
		interface PageData {
			application: Application;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
