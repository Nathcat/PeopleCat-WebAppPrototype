<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import closedImg from "$lib/assets/logo-closed.png";
	import logoImg from "$lib/assets/logo.png";
	import { fade } from "svelte/transition";

	let loaded = $derived(application.loaded);
	let visible = $state(true);

	$effect(() => {
		if (loaded) setTimeout(() => (visible = false), 1000);
		visible = true;
	});
</script>

{#if visible}
	<div class="background" transition:fade={{ duration: 100 }}>
		<div class="content">
			<img
				draggable="false"
				class:loaded
				alt="PeopleCat Logo"
				src={loaded ? logoImg : closedImg}
			/>
			<p>{loaded ? "Welcome to PeopleCat" : "LOADING"}</p>
		</div>
	</div>
	<!-- svelte-ignore a11y_missing_attribute -->
	<!-- Included so that the logo will already be downloaded when connection is established -->
	<img src={logoImg} style="display: none;" />
{/if}

<style lang="scss">
	.background {
		background-color: var(--theme-connecting-background);
		color: var(--theme-connecting-text);
		justify-content: center;
		align-items: center;
		position: fixed;
		display: flex;
		height: 100%;
		z-index: 100;
		width: 100%;
	}

	.content {
		flex-direction: column;
		align-items: center;
		display: flex;

		img {
			transition: transform 200ms ease-out;

			animation-iteration-count: infinite;
			animation-timing-function: ease;
			animation-name: bounce;
			animation-duration: 2s;

			image-rendering: pixelated;
			height: 100px;

			&.loaded {
				animation-iteration-count: 1;
				animation-duration: 0.5s;
				animation-name: finish;
			}
		}
	}

	@keyframes finish {
		0% {
			transform: scale(1.25, 1.25);
		}
		25% {
			transform: scale(1.5, 1.5);
		}
		100% {
			transform: scale(1, 1);
		}
	}

	@keyframes bounce {
		0% {
			transform: scale(1, 1) translateY(0);
		}
		10% {
			transform: scale(1.2, 0.8) translateY(10px);
		}
		30% {
			transform: scale(0.8, 1.2) translateY(-100px);
		}
		50% {
			transform: scale(1.05, 0.9) translateY(0);
		}
		57% {
			transform: scale(1, 1) translateY(-7px);
		}
		64% {
			transform: scale(1, 1) translateY(0);
		}
		100% {
			transform: scale(1, 1) translateY(0);
		}
	}
</style>
