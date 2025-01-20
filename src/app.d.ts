// See https://svelte.dev/docs/kit/types#app.d.ts

// for information about these interfaces
declare global {
	namespace App {
		// interface PageData {}
		// interface Error {}
		// interface Locals {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Promise<T> {
		/**
		 * Displays a toast on rejection of the Promise
		 * @param title Toast title to display, defaults to "Error"
		 * @returns A Promise resolving to `void` if rejected
		 */
		catchToast(title?: string): Promise<T | void>;

		/**
		 * Displays the application loading screen until the Promise settles
		 * @returns The original Promise
		 */
		loading(): Promise<T>;
	}
}

export {};
