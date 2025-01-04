<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import Toaster from "./(components)/toast/Toaster.svelte";
	import Freeze from "./(components)/Connecting.svelte";
	import Loading from "./(components)/Loading.svelte";
	import { onMount } from "svelte";

	let { children } = $props();

	import "greset";
	import "$lib/style.scss";

	onMount(() => {
		application.settings.persist();
		application.connect();
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
