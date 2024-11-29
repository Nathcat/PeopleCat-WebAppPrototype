<script lang="ts">
	import Freeze from "./Freeze.svelte";
	import { onMount } from "svelte";

	let { data, children } = $props();

	import "greset";
	import "$lib/style.scss";

	onMount(() => data.application.connect());
</script>

<Freeze />

<!-- Only render page when loading is complete -->
{#if data.application.loaded}
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
