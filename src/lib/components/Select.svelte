<script lang="ts" module>
	import { faChevronDown, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
	import { melt, createSelect } from "@melt-ui/svelte";
	import { fade } from "svelte/transition";

	export interface SelectOption {
		icon?: IconDefinition;
		onclick?: () => void;
		label: string;
		value: any;
	}
</script>

<script lang="ts">
	import Fa from "svelte-fa";

	let { options, placeholder, value = $bindable() }: Props = $props();
	interface Props {
		options: SelectOption[];
		placeholder?: string;
		value?: string;
	}

	const {
		elements: { trigger, menu, option },
		states: { open, selected },
		helpers: { isSelected },
	} = createSelect<SelectOption>({
		forceVisible: true,
		positioning: {
			placement: "bottom",
			fitViewport: true,
			sameWidth: true,
		},
	});
</script>

<button class="trigger" use:melt={$trigger}>
	<span>
		{#if $selected?.value.icon}
			<Fa icon={$selected.value.icon} />
		{/if}
		{$selected?.value.label || (placeholder ?? "Select an option")}
	</span>
	<span class="chevron"><Fa icon={faChevronDown} /></span>
</button>
{#if $open}
	<div class="menu" use:melt={$menu} transition:fade={{ duration: 50 }}>
		{#each options as o}
			{#if o.onclick}
				<button onclick={o.onclick} class="option">
					{#if o.icon}
						<Fa icon={o.icon} />
					{/if}
					{o.label}
				</button>
			{:else}
				<button use:melt={$option({ value: o })} class="option">
					{#if o.icon}
						<Fa icon={o.icon} />
					{/if}
					{o.label}
				</button>
			{/if}
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

		&:hover,
		&:focus-within {
			background-color: var(--theme-dropdown-hover-background);
			color: var(--theme-dropdown-hover-text);
		}
	}
</style>
