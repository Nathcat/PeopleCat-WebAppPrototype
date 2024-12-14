<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import { env } from "$env/dynamic/public";

	let { id, size = 50 }: { id: number; size?: number } = $props();
	let author = $state(application.cache.getUser(id));
</script>

{#await author}
	<div class="loading" style:--size="{size}px"></div>
{:then author}
	<div
		style:background-image="url({env.PUBLIC_AUTHCAT_URL}pfps/{author.pfpPath})"
		style:--size="{size}px"
	></div>
{/await}

<style lang="scss">
	@use "$lib/util" as util;

	div {
		background-position: center;
		background-size: cover;
		border-radius: 50%;

		width: var(--size);
		min-width: var(--size);
		height: var(--size);
		min-height: var(--size);
	}

	.loading {
		@include util.shimmer(200px);
	}
</style>
