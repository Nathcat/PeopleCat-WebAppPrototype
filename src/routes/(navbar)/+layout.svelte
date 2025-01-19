<script lang="ts">
	import MobileNavbar from "./MobileNavbar.svelte";
	import Navbar from "./Navbar.svelte";
	let { children } = $props();

	let margin = $state(0);
	let innerWidth = $state(0);
	let mobile = $derived(innerWidth < 768);
</script>

<svelte:window bind:innerWidth />

{#if mobile}
	<MobileNavbar />
{:else}
	<nav bind:clientWidth={margin}>
		<Navbar />
	</nav>
{/if}

<div style="margin-{mobile ? 'top' : 'left'}: {margin}px;">
	{@render children()}
</div>

<style lang="scss">
	nav {
		min-width: fit-content;
		position: fixed;
		height: 100vh;
		width: 15vw;
		left: 0;
		top: 0;
	}
</style>
