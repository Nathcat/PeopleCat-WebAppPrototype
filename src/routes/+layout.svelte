<script lang="ts">
	import Toaster from "$lib/components/toast/Toaster.svelte";
	import Freeze from "./Connecting.svelte";
	import { onMount } from "svelte";

	let { data, children } = $props();

	import "greset";
	import "$lib/style.scss";
	import Loading from "./Loading.svelte";

	onMount(() => data.application.connect());
</script>

<Toaster />
<Freeze />
<Loading />

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
