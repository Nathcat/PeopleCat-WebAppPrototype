<script lang="ts">
	import Cache from "$lib/application/cache.svelte";

	let { id }: { id: number } = $props();
	let user = $derived(Cache.users.get(id));
</script>

{#if user}
	<span>{user.fullName}</span>
{:else}
	<span class="loading"></span>
{/if}

<style lang="scss">
	@use "$lib/util" as util;

	span {
		display: inline-block;
		height: 1em;
	}

	.loading {
		width: 200px;
		border-radius: 5px;
		@include util.shimmer(200px);
	}
</style>
