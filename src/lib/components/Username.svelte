<script lang="ts">
	import { env } from "$env/dynamic/public";
	import { page } from "$app/stores";

	let { id }: { id: number } = $props();
	let author = $state($page.data.application.cache.get_user(id));
</script>

{#await author}
	<span class="loading"></span>
{:then author}
	<span>{author.fullName}</span>
{/await}

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
