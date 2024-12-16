<script lang="ts" module>
	import { faChevronDown, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
	import { melt, createSelect } from "@melt-ui/svelte";
	import { fade } from "svelte/transition";

	export interface SelectOption {
		onclick?: () => string | void;
		icon?: IconDefinition;
		label: string;
	}
</script>

<script lang="ts">
	import Fa from "svelte-fa";
	import { untrack } from "svelte";

	let { options, placeholder, value = $bindable() }: Props = $props();
	interface Props {
		options: Record<string, SelectOption>;
		value: string | undefined;
		placeholder?: string;
	}

	const {
		elements: { trigger, menu, option },
		states: { open, selected },
	} = createSelect<string>({
		forceVisible: true,
		positioning: {
			placement: "bottom",
			fitViewport: true,
			sameWidth: true,
		},
	});

	$effect(() => {
		const v = value;
		untrack(() => ($selected = v === undefined ? undefined : { value: v }));
	});

	$effect(() => {
		let v = $selected?.value;
		untrack(() => {
			if (v !== undefined) {
				const onclick = options[v.substring(1)]?.onclick;
				if (onclick) v = onclick() ?? v.substring(1);
			}

			if (value !== v) value = v;
		});
	});

	let current = $derived(value ? options[value] : undefined);
</script>

<button class="trigger" use:melt={$trigger}>
	<span>
		{#if current?.icon}
			<Fa icon={current.icon} />
		{/if}
		{current?.label || (placeholder ?? "Select an option")}
	</span>
	<span class="chevron"><Fa icon={faChevronDown} /></span>
</button>
{#if $open}
	<div class="menu" use:melt={$menu} transition:fade={{ duration: 50 }}>
		{#each Object.entries(options) as [k, o]}
			<button use:melt={$option({ value: `${o.onclick ? "_" : ""}${k}` })} class="option">
				{#if o.icon}
					<Fa icon={o.icon} />
				{/if}
				{o.label}
			</button>
		{/each}
	</div>
{/if}

<style lang="scss">
	.trigger {
		border: 2px solid var(--theme-input-border);
		color: var(--theme-default-text);
		padding: 5px 8px 5px 5px;
		background: transparent;
		min-width: min-content;
		text-decoration: none;
		border-radius: 10px;
		white-space: nowrap;
		display: flex;
		width: 100%;

		.chevron {
			margin-left: auto;
			padding-left: 40px;
		}
	}

	.menu {
		background-color: var(--theme-dropdown-background);
		flex-direction: column;
		border-radius: 10px;
		overflow: hidden;
		display: flex;
	}

	.option {
		color: var(--theme-dropdown-text);
		background-color: transparent;
		text-decoration: none;
		white-space: nowrap;
		text-align: left;
		padding: 8px;
		width: 100%;

		&[data-highlighted] {
			background-color: var(--theme-dropdown-hover-background);
			color: var(--theme-dropdown-hover-text);
		}
	}
</style>
