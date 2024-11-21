<script lang="ts">
	import { env } from "$env/dynamic/public";

	let { path, size = 50 }: { path: string; size?: number } = $props();
	let url = $derived(`${env.PUBLIC_AUTHCAT_URL}pfps/${path}`);
</script>

<div style:background-image="url({url})" style:--size="{size}px"></div>

<style lang="scss">
	div {
		background-position: center;
		background-size: cover;
		border-radius: 50%;

		width: var(--size);
		min-width: var(--size);
		height: var(--size);
		min-height: var(--size);
	}
</style>
