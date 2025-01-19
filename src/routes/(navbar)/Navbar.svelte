<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import { faCog } from "@fortawesome/free-solid-svg-icons";
	import { page } from "$app/stores";
	import Fa from "svelte-fa";
</script>

<div class="container">
	{#each Object.values(application.cache.chats) as chat}
		<a href="/chat/{chat.id}" class:selected={$page.url.pathname == `/chat/${chat.id}`}>
			<div class="icon" style="background-image: url({chat.icon})"></div>
			<span>{chat.name}</span>
		</a>
	{/each}

	<a
		href="/settings"
		style="margin-top: auto;"
		class:selected={$page.url.pathname == "/settings"}
	>
		<Fa icon={faCog} style="font-size: 23px;" />
		<span>Settings</span>
	</a>
</div>

<style lang="scss">
	.container {
		border-right: 1px solid var(--theme-navbar-border);
		background-color: var(--theme-navbar-background);
		flex-direction: column;
		min-width: 200px;
		display: flex;
		height: 100%;
		padding: 5px;
		z-index: 2;
		gap: 5px;

		a {
			transition: background-color 150ms;
			color: var(--theme-default-text);
			padding: 5px 20px 5px 5px;
			text-overflow: ellipsis;
			text-decoration: none;
			align-items: center;
			border-radius: 5px;
			overflow: hidden;
			display: flex;
			width: 100%;

			&:hover,
			&.selected {
				background-color: var(--theme-navbar-hover);
			}

			span {
				margin-left: 10px;
			}
		}

		a::before {
			content: "";
			background-color: var(--theme-navbar-selected);
			transition: all 150ms;
			border-radius: 5px;
			margin-right: 0px;
			height: 100%;
			width: 0px;
		}

		a.selected::before {
			margin-right: 10px;
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
