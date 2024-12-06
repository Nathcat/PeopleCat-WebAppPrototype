<script lang="ts" module>
	import { createToaster } from "@melt-ui/svelte";
	import { flip } from "svelte/animate";
	import Toast from "./Toast.svelte";

	export type ToastType = "info" | "ok" | "error";
	export type ToastData = {
		title: string;
		description: string;
		type: ToastType;
	};

	const {
		helpers,
		elements,
		states: { toasts },
	} = createToaster<ToastData>({ closeDelay: 10000 });

	export const addToast = (data: ToastData) => helpers.addToast({ data });
	export const removeToast = helpers.removeToast;
	export const catchToast = (e: any) =>
		addToast({
			type: "error",
			title: "Error",
			description: e instanceof Error ? e.message : "An unknown error occurred",
		});
</script>

<div class="container">
	{#each $toasts as toast (toast.id)}
		<div animate:flip={{ duration: 250 }}>
			<Toast {toast} {...elements} />
		</div>
	{/each}
</div>

<style lang="scss">
	.container {
		position: fixed;
		padding: 10px;
		z-index: 101;
		bottom: 0;
		right: 0;
	}
</style>
