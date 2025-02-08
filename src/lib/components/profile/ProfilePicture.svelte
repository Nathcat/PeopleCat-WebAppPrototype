<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import { env } from "$env/dynamic/public";

	let { id, size = 50 }: { id: number; size?: number } = $props();
	let author = $state(application.cache.getUser(id));
</script>

{#await author}
	<div class="loading" style:--size="{size}px"></div>
{:then author}
	<div class="outline" style:--size="{size}px">
		<div
			class="image"
			style:background-image="url({env.PUBLIC_AUTHCAT_URL}pfps/{author.pfpPath})"
		></div>
	</div>
{/await}

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
