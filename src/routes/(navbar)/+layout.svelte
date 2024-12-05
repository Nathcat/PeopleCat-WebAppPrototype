<script lang="ts">
	import Navbar from "./Navbar.svelte";

	let { children } = $props();
	let margin = $state(0);
</script>

<Navbar bind:clientWidth={margin} />
<div style="margin-left: {margin}px;">
	{@render children()}
</div>
