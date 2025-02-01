<script lang="ts" module>
	import { createDialog, melt } from "@melt-ui/svelte";
	import { fade } from "svelte/transition";

	let tasks = $state<Promise<any>[]>([]);

	export function loadUntil(task: Promise<any>) {
		tasks.push(task);
		if (tasks.length == 1) next();
		return task;
	}

	const next = () =>
		tasks[0]
			?.then(() => {
				tasks.pop();
				next();
			})
			.catch((e) => {
				console.error(e);
				tasks.pop();
				next();
			});
</script>

<script lang="ts">
	const {
		elements: { content },
		states: { open },
	} = createDialog();

	$effect(() => {
		$open = tasks.length > 0;
	});
</script>

{#if $open}
	<div class="background" use:melt={$content} transition:fade>
		<span class="loader"></span>
	</div>
{/if}

<style lang="scss">
	.background {
		background-color: var(--theme-loading-background);
		backdrop-filter: blur(3px);
		justify-content: center;
		align-items: center;
		position: fixed;
		display: flex;
		height: 100vh;
		width: 100vw;
		z-index: 99;
		left: 0;
		top: 0;
	}

	.loader {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		position: relative;
		animation: rotate 1s linear infinite;

		&::before,
		&::after {
			content: "";
			box-sizing: border-box;
			position: absolute;
			inset: 0px;
			border-radius: 50%;
			border: 5px solid var(--theme-loading);
			animation: prixClipFix 2s linear forwards;
		}

		&::after {
			inset: 8px;
			transform: rotate3d(90, 90, 0, 180deg);
			border-color: var(--theme-loading-accent);
		}
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes prixClipFix {
		0% {
			clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
		}
		50% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
		}
		75%,
		100% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
		}
	}
</style>
