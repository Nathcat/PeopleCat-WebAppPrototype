<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import Freeze from "./Connecting.svelte";
	import { dev } from "$app/environment";
	import Loading from "./Loading.svelte";
	import Toaster from "./Toaster.svelte";
	import { onMount } from "svelte";

	let { children } = $props();

	import "greset";
	import "$lib/style.scss";
	import { isIos } from "@melt-ui/svelte/internal/helpers";

	onMount(() => {
		application.settings.persist();
		application.connect();

		// @ts-ignore
		if (dev) window.application = application;
	});
</script>

<div data-sveltekit-replacestate={isIos()}>
	<Toaster />
	<Freeze />
	<Loading />

	<!-- Only render page when loading is complete -->
	{#if application.loaded}
		<main>
			{@render children()}
		</main>
	{/if}
</div>

<style lang="scss">
	main {
		flex-direction: column;
		display: flex;
	}
</style>
