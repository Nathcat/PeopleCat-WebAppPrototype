<script lang="ts">
	import { createSlider, melt, createSync, type CreateSliderProps } from "@melt-ui/svelte";
	import { propertyStore } from "svelte-writable-derived";

	let {
		fills = true,
		value = $bindable(0),
		...options
	}: {
		/**
		 * Wether the left side of this slider fills
		 * @default true
		 */
		fills?: boolean;
		/**
		 * The bindable value currently on the slider
		 * @default 0
		 */
		value?: number;
	} & Omit<CreateSliderProps, "value"> = $props();

	let clientWidth = $state(0);

	const {
		states,
		elements: { root, range, thumbs, ticks },
	} = createSlider(options);

	const sync = createSync({ value: propertyStore(states.value, 0) });
	$effect(() => sync.value(value, (v) => (value = v)));
</script>

<span use:melt={$root} class="root" bind:clientWidth>
	<span class="track">
		{#if fills}
			<span use:melt={$range}></span>
		{/if}
	</span>

	{#if clientWidth / $ticks.length > 20}
		{#each $ticks as tick}
			<span use:melt={tick} class="tick"></span>
		{/each}
	{/if}

	<span use:melt={$thumbs[0]} class="thumb"></span>
</span>

<style lang="scss">
	.root {
		align-items: center;
		position: relative;
		margin: 2px 15px;
		display: flex;
		height: 30px;
	}

	.track {
		background-color: var(--theme-slider-track);
		border-radius: 5px;
		height: 5px;
		width: 100%;

		&:empty {
			background-color: var(--theme-slider-fill);
		}

		span {
			background-color: var(--theme-slider-fill);
			border-radius: inherit;
			height: inherit;
		}
	}

	.tick {
		background-color: var(--theme-slider-tick);
		border-radius: 100%;
		height: 3px;
		width: 3px;

		&[data-bounded] {
			background-color: var(--theme-slider-tick-filled);
		}
	}

	.thumb {
		background-color: var(--theme-slider-thumb);
		border: solid 2px var(--theme-slider-tick);
		border-radius: 100%;
		height: 25px;
		width: 25px;
	}
</style>
