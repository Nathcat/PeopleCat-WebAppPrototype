<script lang="ts" module>
	import { application } from "$lib/application/application.svelte";
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

	export { helpers };
</script>

<div class="container" style:bottom="{application.settings.margin}px">
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
