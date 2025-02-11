<script lang="ts">
	import Cache from "$lib/application/cache.svelte";
	import { env } from "$env/dynamic/public";

	let { id, size = 50 }: { id: number; size?: number } = $props();
	let user = $derived(Cache.users.get(id));
</script>

{#if user}
	<div class="outline" style:--size="{size}px">
		<div
			class="image"
			style:background-image="url({env.PUBLIC_AUTHCAT_URL}pfps/{user.pfpPath})"
		></div>
	</div>
{:else}
	<div class="loading" style:--size="{size}px"></div>
{/if}

<style lang="scss">
	@use "$lib/util" as util;

	.outline {
		background: linear-gradient(45deg, #e600ff 0%, #00ccff 100%);
		border-radius: 50%;

		width: var(--size);
		min-width: var(--size);
		height: var(--size);
		min-height: var(--size);
	}

	.image {
		background-position: center;
		background-size: cover;
		border-radius: 50%;

		height: 95%;
		width: 95%;
	}

	.loading {
		@include util.shimmer(200px);
	}
</style>
