<script lang="ts">
	import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
	import Navbar from "./Navbar.svelte";
	import Fa from "svelte-fa";

	let { children, data } = $props();

	let margin = $state(0);
	let innerWidth = $state(0);
	let mobile = $derived(innerWidth < 768);
	let root = $derived(data.path.length == 0);
</script>

<svelte:window bind:innerWidth />

{#if root || !mobile}
	<Navbar bind:clientWidth={margin} {mobile} />
{:else}
	<div class="backbar" bind:clientHeight={margin}>
		<a class="back" href="/">
			<Fa icon={faArrowLeft} />
		</a>
	</div>
{/if}

{#if !root || !mobile}
	<div style="margin-{mobile ? 'top' : 'left'}: {margin}px;">
		{@render children()}
	</div>
{/if}

<style lang="scss">
	.backbar {
		background-color: var(--theme-navbar-background);
		border-bottom: 1px solid var(--theme-navbar-border);
		position: fixed;
		display: flex;
		width: 100%;
	}

	.back {
		padding: 8px;
	}
</style>
