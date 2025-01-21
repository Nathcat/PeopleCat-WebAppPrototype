<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import { browser, dev } from "$app/environment";
	import Freeze from "./Connecting.svelte";
	import Loading from "./Loading.svelte";
	import Toaster from "./Toaster.svelte";
	import { onMount } from "svelte";

	let { children } = $props();

	import "greset";
	import "$lib/style.scss";

	onMount(() => {
		application.settings.persist();
		application.connect();

		// @ts-ignore
		if (dev) window.application = application;
	});

	function iOS() {
		return (
			[
				"iPad Simulator",
				"iPhone Simulator",
				"iPod Simulator",
				"iPad",
				"iPhone",
				"iPod",
			].includes(navigator.platform) ||
			// iPad on iOS 13 detection
			(navigator.userAgent.includes("Mac") && "ontouchend" in document)
		);
	}
</script>

<div data-sveltekit-replacestate={browser && iOS()}>
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
