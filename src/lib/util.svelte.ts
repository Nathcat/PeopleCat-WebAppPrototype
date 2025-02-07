import { helpers, type ToastData } from "../routes/Toaster.svelte";
import { loadUntil } from "../routes/Loading.svelte";
import type { Action } from "svelte/action";
import { onMount } from "svelte";
import { goto as _goto } from "$app/navigation";
import { isIos } from "@melt-ui/svelte/internal/helpers";
import { browser } from "$app/environment";

/**
 * Create persistent state, stored in `localStorage`
 * @param key The `localsStorage` key
 */
export function persist<T>(key: string): { value: T | undefined };

/**
 * Create persistent state, stored in `localStorage`
 * @param key The `localStorage` key
 * @param initial Initial value if unset in `localStorage`
 */
export function persist<T>(key: string, initial: T): { value: T };
export function persist<T>(key: string, initial?: T) {
	const stored = browser ? localStorage.getItem(key) : "null";
	let value = $state<T>(stored === null ? initial : JSON.parse(stored));

	return {
		get value() {
			return value;
		},
		set value(v) {
			localStorage.setItem(key, JSON.stringify(v));
			value = v;
		},
	};
}

/**
 * A wrapper around {@link _goto|SvelteKit's `goto`} function to always replace state on iOS.
 * @param url Where to navigate to.
 * @param opts Options related to the navigation.
 */
export const goto: typeof _goto = (url, opts) => {
	if (opts && isIos()) opts.replaceState = true;
	return _goto(url, opts);
};

// Prototype to extend promise
Promise.prototype.loading = function () {
	loadUntil(this);
	return this;
};

/**
 * Create and display a toast with the given data.
 * @param data The toast data to display.
 * @returns The created toast.
 */
export const toast = (data: ToastData) => helpers.addToast({ data });

// Prototype to extend promise
Promise.prototype.catchToast = function (title?: string) {
	return this.catch((e) => {
		toast({
			type: "error",
			title: title ?? "Error",
			description: e instanceof Error ? e.message : "An unknown error occurred",
		});
	});
};

/**
 * Set up a self-requesting animation frame.
 * @param fn Callback to run every animation frame
 */
export const animationFrame = (fn: () => void) =>
	onMount(() => {
		let request: number;

		function wrapper() {
			request = requestAnimationFrame(wrapper);
			fn();
		}

		request = requestAnimationFrame(wrapper);
		return () => cancelAnimationFrame(request);
	});

/**
 * Sets up HammerJS oh this element
 * @param element The element to setup HammerJS on
 * @param fn A setup callback the {@link HammerManager} is passed to
 */
export const hammer: Action<HTMLElement, (hammer: HammerManager) => any, {}> = (element, fn) =>
	onMount(() => {
		let hammer: HammerManager;

		import("hammerjs").then(() => {
			hammer = new Hammer(element, { recognizers: [] });
			fn(hammer);
		});

		return () => hammer?.destroy();
	});

/**
 * Call a server-side action
 * @param action The name of the action to call
 * @param body Optional body to include with the request
 */
export async function action(action: string, body?: BodyInit) {
	body ??= "";

	const response = await fetch(`${window.location}?/${action}`, {
		credentials: "include",
		method: "POST",
		body,
	});

	if (!response.ok) throw new Error("Response from server was not ok");
	const data = await response.json().catch(() => {
		throw new Error("Could not parse response from server");
	});

	if (data["type"] != "success") throw new Error("Server did not indicate success");
}
