<script lang="ts">
	import Navbar from "./Navbar.svelte";
	import { hammer } from "$lib/util";

	let { open }: { open?: boolean } = $props();

	function gestures(hammer: HammerManager) {
		hammer.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
		hammer.on("swipe", (e) => {
			if (e.pointerType !== "touch" || e.target.closest(".no-swipe")) return;
			open = e.direction === Hammer.DIRECTION_RIGHT;
		});
	}
</script>

<svelte:body use:hammer={gestures} />

<nav class:open>
	<Navbar onnavigate={() => (open = false)} />
</nav>

<style lang="scss">
	nav {
		transition: left 250ms ease-in-out;
		width: calc(100vw + 1px);
		left: calc(-100vw - 1px);
		position: fixed;
		height: 100vh;
		z-index: 100;

		&.open {
			left: 0;
		}
	}
</style>
