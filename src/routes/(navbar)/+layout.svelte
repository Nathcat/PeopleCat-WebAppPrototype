<script lang="ts">
	import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
	import MobileNavbar from "./MobileNavbar.svelte";
	import Navbar from "./Navbar.svelte";
	import Fa from "svelte-fa";
	import { elements } from "./Titlebar.svelte";

	let { children } = $props();

	let marginTop = $state(0);
	let marginLeft = $state(0);
	let innerWidth = $state(0);
	let mobile = $derived(innerWidth < 768);
	let open = $state(false);
</script>

<svelte:window bind:innerWidth />

{#if mobile || elements}
	<div
		class="titlebar"
		bind:clientHeight={marginTop}
		style:margin-left="{mobile ? 0 : marginLeft}px"
	>
		{#if mobile}
			<button class="back" onclick={() => (open = true)}>
				<Fa icon={faArrowLeft} />
			</button>
		{/if}
		{#each elements as element}
			{@render element()}
		{/each}
	</div>
{/if}

{#if mobile}
	<MobileNavbar bind:open />
{:else}
	<nav bind:clientWidth={marginLeft}>
		<Navbar />
	</nav>
{/if}

<div style="margin-{mobile ? 'top' : 'left'}: {mobile ? marginTop : marginLeft}px">
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
