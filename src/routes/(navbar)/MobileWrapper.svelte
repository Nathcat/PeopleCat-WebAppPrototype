<script lang="ts">
	import { onMount } from "svelte";
	import Navbar from "./Navbar.svelte";

	let status = $state<"free" | "paused" | "swiping" | "out">("free");
	let old: [number, number];
	let x = $state(0);

	function ontouchmove(e: TouchEvent) {
		if (status === "out" || status === "paused") return;

		for (const touch of e.targetTouches) {
			const delta = [touch.clientX - old[0], touch.clientY - old[1]];

			if (status === "free") {
				const angle = Math.atan(delta[1] / delta[0]) * (180 / Math.PI);
				status = Math.abs(angle) > 25 ? "paused" : "swiping";
				if (status === "paused") return;
			}

			x += delta[0];
			old = [touch.clientX, touch.clientY];
		}
	}

	function ontouchend() {
		if (x >= window.innerWidth / 3) status = "out";
		else status = "free";
	}

	function ontouchstart(e: TouchEvent) {
		for (const touch of e.targetTouches) old = [touch.clientX, touch.clientY];
	}

	onMount(() => {
		let request: number;

		(function spring() {
			request = requestAnimationFrame(spring);
			if (status === "out") x += (window.innerWidth + 1 - x) / 2;
			else if (status === "free") x -= x / 4;
		})();

		return () => cancelAnimationFrame(request);
	});
</script>

<svelte:window {ontouchend} {ontouchstart} {ontouchmove} />

<nav style:left="calc(-100vw - 1px + min({x}px, calc(100vw + 1px)))" class:out={status === "out"}>
	<Navbar onnavigate={() => (status = "free")} />
</nav>

<style lang="scss">
	nav {
		width: calc(100vw + 1px);
		position: fixed;
		height: 100vh;
		z-index: 100;
	}
</style>
