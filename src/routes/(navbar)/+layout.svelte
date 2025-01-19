<script lang="ts">
	import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
	import MobileNavbar from "./MobileNavbar.svelte";
	import Navbar from "./Navbar.svelte";
	import Fa from "svelte-fa";

	let { children } = $props();

	let margin = $state(0);
	let innerWidth = $state(0);
	let mobile = $derived(innerWidth < 768);
	let open = $state(false);
</script>

<svelte:window bind:innerWidth />

{#if mobile}
	<div class="titlebar" bind:clientHeight={margin}>
		{#if mobile}
			<button class="back" onclick={() => (open = true)}>
				<Fa icon={faArrowLeft} />
			</button>
		{/if}
	</div>
{/if}

{#if mobile}
	<MobileNavbar bind:open />
{:else}
	<nav bind:clientWidth={margin}>
		<Navbar />
	</nav>
{/if}

<div style="margin-{mobile ? 'top' : 'left'}: {margin}px">
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

	.titlebar {
		background-color: var(--theme-navbar-background);
		border-bottom: 1px solid var(--theme-navbar-border);
		position: fixed;
		display: flex;
		width: 100%;
		top: 0;
	}

	.back {
		padding: 8px;
	}
</style>
