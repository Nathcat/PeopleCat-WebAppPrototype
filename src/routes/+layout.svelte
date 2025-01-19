<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import Toaster from "./(components)/toast/Toaster.svelte";
	import Freeze from "./(components)/Connecting.svelte";
	import Loading from "./(components)/Loading.svelte";
	import { onMount } from "svelte";

	let { children } = $props();

	import "greset";
	import "$lib/style.scss";
	import { dev } from "$app/environment";
	import { beforeNavigate, goto } from "$app/navigation";

	onMount(() => {
		application.settings.persist();
		application.connect();

		// Disable back gesture on mobile devices by disabling history
		if ("ontouchstart" in window) {
			let previousNavigation: string = "";
			beforeNavigate((navigation) => {
				if (
					navigation.to &&
					window.innerWidth < 768 &&
					navigation.to.url.toString() != previousNavigation
				) {
					previousNavigation = navigation.to.url.toString();
					goto(navigation.to.url, { replaceState: true });
					navigation.cancel();
				}
			});
		}

		// @ts-ignore
		if (dev) window.application = application;
	});
</script>

<Toaster />
<Freeze />
<Loading />

<!-- Only render page when loading is complete -->
{#if application.loaded}
	<main>
		{@render children()}
	</main>
{/if}

<style lang="scss">
	main {
		flex-direction: column;
		display: flex;
	}
</style>
