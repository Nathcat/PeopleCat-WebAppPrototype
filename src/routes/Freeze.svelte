<script lang="ts">
	import closedImg from "$lib/assets/logo-closed.png";
	import logoImg from "$lib/assets/logo.png";
	import { fade } from "svelte/transition";
	import { page } from "$app/stores";

	let done = $derived($page.data.application.ready);
	let visible = $state(true);

	$effect(() => {
		if (done) setTimeout(() => (visible = false), 1000);
		visible = true;
	});
</script>

{#if visible}
	<div class="background" transition:fade={{ duration: 100 }}>
		<div class="content">
			<img
				draggable="false"
				class:done
				alt="PeopleCat Logo"
				src={done ? logoImg : closedImg}
			/>
			<p>{done ? "Welcome to PeopleCat" : "LOADING"}</p>
		</div>
	</div>
{/if}

<style lang="scss">
	.background {
		background-color: var(--dark-1);
		justify-content: center;
		align-items: center;
		position: fixed;
		display: flex;
		height: 100%;
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

			&.done {
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
