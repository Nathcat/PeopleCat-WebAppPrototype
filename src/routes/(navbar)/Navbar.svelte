<script lang="ts">
	import { page } from "$app/stores";

	let { clientWidth = $bindable(0) } = $props();
</script>

<div class="container" bind:clientWidth>
	{#each Object.values($page.data.application.cache.chats) as chat}
		<a href="/chat/{chat.id}" class:selected={$page.url.pathname == `/chat/${chat.id}`}>
			<div class="icon" style="background-image: url({chat.icon})"></div>
			<span>{chat.name}</span>
		</a>
	{/each}
</div>

<style lang="scss">
	.container {
		border-right: 1px solid var(--theme-navbar-border);
		flex-direction: column;
		min-width: 200px;
		position: fixed;
		display: flex;
		height: 100vh;
		padding: 5px;
		width: 15vw;
		z-index: 2;
		gap: 5px;
		left: 0;
		top: 0;

		a {
			transition: background-color 150ms;
			padding: 5px 20px 5px 10px;
			text-overflow: ellipsis;
			align-items: center;
			border-radius: 5px;
			overflow: hidden;
			display: flex;
			gap: 10px;

			&:hover,
			&.selected {
				background-color: var(--theme-navbar-hover);
			}
		}

		a.selected::before {
			content: "";
			background-color: var(--theme-navbar-selected);
			border-radius: 5px;
			height: 100%;
			width: 3px;
		}
	}

	.icon {
		background-position: center;
		background-size: cover;
		border-radius: 50%;

		min-height: 48px;
		min-width: 48px;
	}
</style>
